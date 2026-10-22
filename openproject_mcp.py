"""
OpenProject MCP Server - Dành riêng cho thành viên dự án QLDAPM
Quản lý cây công việc phân cấp: Epic (Level 1) -> Task (Level 2) -> SubTask (Level 3)
Phù hợp với vai trò User / Team Member (không yêu cầu quyền Admin)
"""

import sys
import os
import json
import base64
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional, Dict, Any, List

# Đảm bảo mã hóa UTF-8 trên Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from mcp.server.mcpserver import MCPServer

# ==================== CẤU HÌNH DỰ ÁN QLDAPM ====================
DEFAULT_URL = "http://26.65.103.140/api/v3"
DEFAULT_API_KEY = "ACCESS TOKEN HERE"
PROJECT_IDENTIFIER = "qldapm"
PROJECT_ID = 3

BASE_URL = os.getenv("OPENPROJECT_URL", DEFAULT_URL).rstrip("/")
if not BASE_URL.endswith("/api/v3"):
    BASE_URL = f"{BASE_URL}/api/v3"

API_KEY = os.getenv("OPENPROJECT_API_KEY", DEFAULT_API_KEY)
AUTH_HEADER = "Basic " + base64.b64encode(f"apikey:{API_KEY}".encode()).decode()

# ==================== TỪ ĐIỂN MAPPING (CHUẨN DỰ ÁN QLDAPM) ====================
TYPE_MAP = {
    "epic": 5,
    "task": 1,
    "subtask": 8,
    "sub_task": 8,
    "sub-task": 8,
    "milestone": 2,
    "bug": 7,
    "story": 6,
    "user story": 6,
    "summary task": 3,
}

STATUS_MAP = {
    "new": 1,
    "to do": 16,
    "todo": 16,
    "in progress": 7,
    "in_progress": 7,
    "dev in progress": 17,
    "dev": 17,
    "ba in progress": 18,
    "ba": 18,
    "ba review": 19,
    "in review": 20,
    "review": 20,
    "ready for test": 10,
    "testing": 9,
    "test": 9,
    "rework": 14,
    "done": 15,
    "closed": 12,
}

mcp = MCPServer("openproject-qldapm-mcp")

# ==================== HELPER REQUESTS ====================
def op_request(endpoint: str, data: Optional[Dict[str, Any]] = None, method: Optional[str] = None) -> Dict[str, Any]:
    url = f"{BASE_URL}{endpoint}" if endpoint.startswith("/") else endpoint
    body = json.dumps(data).encode("utf-8") if data is not None else None
    
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", AUTH_HEADER)
    req.add_header("Content-Type", "application/json")
    
    if "127.0.0.1" in url or "localhost" in url:
        req.add_header("Host", "26.65.103.140")

    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status == 204:
                return {"status": "success", "message": "No Content"}
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {"status": "success"}
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        try:
            parsed = json.loads(error_msg)
            return {"error": True, "http_status": e.code, "details": parsed}
        except Exception:
            return {"error": True, "http_status": e.code, "message": error_msg}
    except Exception as e:
        return {"error": True, "message": str(e)}


def _parse_wp_item(el: Dict[str, Any]) -> Dict[str, Any]:
    links = el.get("_links", {})
    parent_info = links.get("parent")
    parent_href = parent_info.get("href") if isinstance(parent_info, dict) else None
    parent_id = parent_href.split("/")[-1] if parent_href else None

    return {
        "id": el.get("id"),
        "subject": el.get("subject"),
        "type": links.get("type", {}).get("title") if isinstance(links.get("type"), dict) else None,
        "status": links.get("status", {}).get("title") if isinstance(links.get("status"), dict) else None,
        "startDate": el.get("startDate"),
        "dueDate": el.get("dueDate"),
        "percentageDone": el.get("percentageDone"),
        "estimatedTime": el.get("estimatedTime"),
        "assignee": links.get("assignee", {}).get("title") if isinstance(links.get("assignee"), dict) else None,
        "parent_id": int(parent_id) if parent_id and parent_id.isdigit() else None
    }


def _resolve_status_id(status_input: Any) -> Optional[int]:
    if status_input is None:
        return None
    if isinstance(status_input, int):
        return status_input
    key = str(status_input).strip().lower()
    return STATUS_MAP.get(key, 16)


# ==================== MCP TOOLS (USER / MEMBER ROLE) ====================

@mcp.tool()
def get_project_overview() -> str:
    """
    Thống kê tổng quan dự án QLDAPM:
    - Tổng số công việc hiện tại.
    - Phân bố theo trạng thái (To Do, Dev in progress, BA in progress, Testing, Done, Closed...).
    - Danh sách các Epic chính đang có trong dự án.
    """
    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages?pageSize=100")
    if "error" in res:
        return f"Lỗi khi đọc dự án: {json.dumps(res, ensure_ascii=False)}"
    
    total = res.get("total", 0)
    elements = res.get("_embedded", {}).get("elements", [])
    
    status_counts = {}
    type_counts = {}
    epics = []

    for el in elements:
        wp = _parse_wp_item(el)
        st = wp["status"] or "Chưa rõ"
        tp = wp["type"] or "Khác"
        status_counts[st] = status_counts.get(st, 0) + 1
        type_counts[tp] = type_counts.get(tp, 0) + 1
        
        if tp == "Epic":
            epics.append({
                "id": wp["id"],
                "subject": wp["subject"],
                "status": wp["status"],
                "percentageDone": wp["percentageDone"],
                "startDate": wp["startDate"],
                "dueDate": wp["dueDate"]
            })

    summary = {
        "project": "QLDAPM",
        "total_work_packages": total,
        "types_breakdown": type_counts,
        "statuses_breakdown": status_counts,
        "epics": epics
    }
    return json.dumps(summary, ensure_ascii=False, indent=2)


@mcp.tool()
def list_epics() -> str:
    """
    Liệt kê tất cả các Epic (công việc cấp 1) trong dự án QLDAPM.
    Trả về ID, tiêu đề, trạng thái, tiến độ (% done), ngày bắt đầu và kết thúc.
    """
    filters = json.dumps([{"type": {"operator": "=", "values": ["5"]}}])
    endpoint = f"/projects/{PROJECT_IDENTIFIER}/work_packages?filters={urllib.parse.quote(filters)}&pageSize=50"
    res = op_request(endpoint)
    if "error" in res:
        return f"Lỗi: {json.dumps(res, ensure_ascii=False)}"
    
    epics = [_parse_wp_item(el) for el in res.get("_embedded", {}).get("elements", [])]
    return json.dumps(epics, ensure_ascii=False, indent=2)


@mcp.tool()
def get_epic_tree(epic_id: int) -> str:
    """
    Lấy toàn bộ cây công việc phân cấp hoàn chỉnh của một Epic:
    Epic -> Danh sách Task con (Level 2) -> Danh sách SubTask cháu (Level 3).
    Rất hữu ích để theo dõi tiến độ tổng thể của một phân hệ/sprint.
    """
    # 1. Lấy thông tin Epic
    epic_res = op_request(f"/work_packages/{epic_id}")
    if "error" in epic_res:
        return f"Không tìm thấy Epic #{epic_id}: {json.dumps(epic_res, ensure_ascii=False)}"
    
    epic_item = _parse_wp_item(epic_res)
    
    # 2. Lấy toàn bộ work packages trong project để dựng cây
    all_wp_res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages?pageSize=100")
    all_items = [_parse_wp_item(el) for el in all_wp_res.get("_embedded", {}).get("elements", [])]
    
    # Gom nhóm theo parent_id
    by_parent = {}
    for it in all_items:
        p_id = it.get("parent_id")
        if p_id is not None:
            by_parent.setdefault(p_id, []).append(it)
            
    # Lấy các task con của Epic
    child_tasks = by_parent.get(epic_id, [])
    task_trees = []
    
    for t in child_tasks:
        subtasks = by_parent.get(t["id"], [])
        task_data = dict(t)
        task_data["subtasks"] = subtasks
        task_data["subtasks_count"] = len(subtasks)
        task_trees.append(task_data)
        
    tree = {
        "epic": epic_item,
        "tasks_count": len(task_trees),
        "tasks": task_trees
    }
    return json.dumps(tree, ensure_ascii=False, indent=2)


@mcp.tool()
def list_my_tasks(status: Optional[str] = None, only_done: bool = False) -> str:
    """
    Liệt kê danh sách các công việc được giao cho chính bạn (tự động nhận diện tài khoản qua API Token).
    - status: Lọc theo trạng thái ('To Do', 'In progress', 'Done', 'Closed'...).
    - only_done: Nếu True, chỉ lấy các task đã hoàn thành (tiến độ 100% hoặc trạng thái Done/Closed).
    """
    me = op_request("/users/me")
    my_id = me.get("id")
    my_name = me.get("name", "Người dùng")
    
    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages?pageSize=100")
    if "error" in res:
        return f"Lỗi: {json.dumps(res, ensure_ascii=False)}"
        
    my_tasks = []
    for el in res.get("_embedded", {}).get("elements", []):
        wp = _parse_wp_item(el)
        links = el.get("_links", {})
        assignee_href = links.get("assignee", {}).get("href")
        
        if assignee_href == f"/api/v3/users/{my_id}" or (my_name and my_name in str(wp.get("assignee"))):
            st = wp.get("status") or ""
            pct = wp.get("percentageDone") or 0
            is_done = st.lower() in ["done", "closed"] or pct == 100
            
            if only_done and not is_done:
                continue
            if status and status.lower() not in st.lower():
                continue
                
            my_tasks.append(wp)
            
    summary = {
        "user": my_name,
        "user_id": my_id,
        "filter_only_done": only_done,
        "count": len(my_tasks),
        "tasks": my_tasks
    }
    return json.dumps(summary, ensure_ascii=False, indent=2)


@mcp.tool()
def list_tasks(epic_id: Optional[int] = None, status: Optional[str] = None) -> str:
    """
    Liệt kê danh sách các Task (công việc cấp 2) trong dự án QLDAPM.
    - epic_id: Lọc các Task thuộc một Epic cụ thể (nếu có).
    - status: Lọc theo trạng thái ('To Do', 'Dev in progress', 'BA in progress', 'Testing', 'Done'...).
    """
    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages?pageSize=100")
    if "error" in res:
        return f"Lỗi: {json.dumps(res, ensure_ascii=False)}"
    
    tasks = []
    for el in res.get("_embedded", {}).get("elements", []):
        wp = _parse_wp_item(el)
        if wp["type"] != "Task":
            continue
        if epic_id is not None and wp.get("parent_id") != epic_id:
            continue
        if status and status.lower() not in (wp["status"] or "").lower():
            continue
        tasks.append(wp)
        
    return json.dumps(tasks, ensure_ascii=False, indent=2)


@mcp.tool()
def list_subtasks(task_id: int) -> str:
    """
    Liệt kê tất cả các SubTask (Level 3) nằm dưới một Task cụ thể.
    - task_id: ID của Task cha.
    """
    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages?pageSize=100")
    if "error" in res:
        return f"Lỗi: {json.dumps(res, ensure_ascii=False)}"
    
    subtasks = []
    for el in res.get("_embedded", {}).get("elements", []):
        wp = _parse_wp_item(el)
        if wp.get("parent_id") == task_id:
            subtasks.append(wp)
            
    return json.dumps(subtasks, ensure_ascii=False, indent=2)


@mcp.tool()
def create_epic(
    subject: str,
    description: str = "",
    start_date: Optional[str] = None,
    due_date: Optional[str] = None
) -> str:
    """
    Tạo một Epic mới (Level 1) cho dự án QLDAPM.
    - subject: Tiêu đề Epic (ví dụ: '[Epic 5: Tích hợp Cổng thanh toán VNPay]')
    - description: Mô tả chi tiết phạm vi Epic
    - start_date: Ngày bắt đầu ('YYYY-MM-DD')
    - due_date: Ngày kết thúc ('YYYY-MM-DD')
    """
    payload: Dict[str, Any] = {
        "subject": subject,
        "description": {"format": "markdown", "raw": description},
        "_links": {
            "type": {"href": "/api/v3/types/5"},  # 5 = Epic
            "status": {"href": "/api/v3/statuses/1"}  # 1 = New
        }
    }
    if start_date:
        payload["startDate"] = start_date
    if due_date:
        payload["dueDate"] = due_date
        
    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages", data=payload, method="POST")
    if "error" in res:
        return f"Tạo Epic thất bại: {json.dumps(res, ensure_ascii=False)}"
    return f"Đã tạo Epic #{res.get('id')}: {res.get('subject')}"


@mcp.tool()
def create_task(
    subject: str,
    epic_id: Optional[int] = None,
    description: str = "",
    start_date: Optional[str] = None,
    due_date: Optional[str] = None,
    status: str = "To Do",
    estimated_hours: Optional[float] = None
) -> str:
    """
    Tạo một Task mới (Level 2).
    - subject: Tiêu đề Task (ví dụ: '[Màn hình] Thanh toán đơn hàng')
    - epic_id: ID của Epic cha mà Task này thuộc về (khuyên dùng để giữ đúng cấu trúc cây)
    - description: Mô tả chi tiết yêu cầu
    - status: 'To Do', 'New', 'Dev in progress', 'BA in progress'...
    - start_date, due_date: 'YYYY-MM-DD'
    - estimated_hours: Số giờ ước lượng (ví dụ: 16.0)
    """
    status_id = _resolve_status_id(status)
    payload: Dict[str, Any] = {
        "subject": subject,
        "description": {"format": "markdown", "raw": description},
        "_links": {
            "type": {"href": "/api/v3/types/1"},  # 1 = Task
            "status": {"href": f"/api/v3/statuses/{status_id}"}
        }
    }
    if epic_id:
        payload["_links"]["parent"] = {"href": f"/api/v3/work_packages/{epic_id}"}
    if start_date:
        payload["startDate"] = start_date
    if due_date:
        payload["dueDate"] = due_date
    if estimated_hours is not None:
        payload["estimatedTime"] = f"PT{int(estimated_hours)}H"

    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages", data=payload, method="POST")
    if "error" in res:
        return f"Tạo Task thất bại: {json.dumps(res, ensure_ascii=False)}"
    parent_str = f" (thuộc Epic #{epic_id})" if epic_id else ""
    return f"Đã tạo Task #{res.get('id')}{parent_str}: {res.get('subject')}"


@mcp.tool()
def create_subtask(
    subject: str,
    task_id: int,
    description: str = "",
    start_date: Optional[str] = None,
    due_date: Optional[str] = None,
    status: str = "To Do",
    estimated_hours: Optional[float] = None
) -> str:
    """
    Tạo một SubTask mới (Level 3) nằm dưới một Task.
    - subject: Tiêu đề SubTask (ví dụ: '[FE] Thiết kế giao diện nút bấm VNPay', '[BE] Viết API callback VNPay')
    - task_id: ID của Task cha (BẮT BUỘC)
    - description: Mô tả chi tiết
    - status: 'To Do', 'Dev in progress', 'Testing', 'Done'...
    - estimated_hours: Số giờ ước lượng (ví dụ: 8.0)
    """
    status_id = _resolve_status_id(status)
    payload: Dict[str, Any] = {
        "subject": subject,
        "description": {"format": "markdown", "raw": description},
        "_links": {
            "type": {"href": "/api/v3/types/8"},  # 8 = SubTask
            "status": {"href": f"/api/v3/statuses/{status_id}"},
            "parent": {"href": f"/api/v3/work_packages/{task_id}"}
        }
    }
    if start_date:
        payload["startDate"] = start_date
    if due_date:
        payload["dueDate"] = due_date
    if estimated_hours is not None:
        payload["estimatedTime"] = f"PT{int(estimated_hours)}H"

    res = op_request(f"/projects/{PROJECT_IDENTIFIER}/work_packages", data=payload, method="POST")
    if "error" in res:
        return f"Tạo SubTask thất bại: {json.dumps(res, ensure_ascii=False)}"
    return f"Đã tạo SubTask #{res.get('id')} (thuộc Task #{task_id}): {res.get('subject')}"


@mcp.tool()
def update_task_progress(
    work_package_id: int,
    status: Optional[str] = None,
    percentage_done: Optional[int] = None,
    comment: Optional[str] = None,
    start_date: Optional[str] = None,
    due_date: Optional[str] = None
) -> str:
    """
    Cập nhật tiến độ hàng ngày cho công việc (Epic, Task hoặc SubTask).
    - work_package_id: ID công việc cần cập nhật.
    - status: Tên trạng thái bằng chữ ('To Do', 'Dev in progress', 'BA in progress', 'Testing', 'Done', 'Closed').
    - percentage_done: Phần trăm hoàn thành (0 - 100).
    - comment: Ghi chú / báo cáo tiến độ công việc để lưu vào lịch sử hoạt động.
    - start_date, due_date: Cập nhật lại ngày nếu có gia hạn/thay đổi ('YYYY-MM-DD').
    """
    current = op_request(f"/work_packages/{work_package_id}")
    if "error" in current:
        return f"Không tìm thấy công việc #{work_package_id}: {json.dumps(current, ensure_ascii=False)}"
    
    lock_version = current.get("lockVersion", 0)
    payload: Dict[str, Any] = {"lockVersion": lock_version}
    
    if percentage_done is not None:
        payload["percentageDone"] = max(0, min(100, percentage_done))
    if start_date is not None:
        payload["startDate"] = start_date
    if due_date is not None:
        payload["dueDate"] = due_date
    if comment:
        payload["comment"] = {"raw": comment}
        
    if status is not None:
        status_id = _resolve_status_id(status)
        if status_id:
            payload["_links"] = {"status": {"href": f"/api/v3/statuses/{status_id}"}}

    res = op_request(f"/work_packages/{work_package_id}", data=payload, method="PATCH")
    if "error" in res:
        return f"Cập nhật thất bại: {json.dumps(res, ensure_ascii=False)}"
    
    current_status = res.get("_links", {}).get("status", {}).get("title")
    pct = res.get("percentageDone")
    return f"Đã cập nhật công việc #{work_package_id} '{res.get('subject')}': Trạng thái = [{current_status}], Tiến độ = {pct}%"


@mcp.tool()
def get_work_package_details(work_package_id: int) -> str:
    """
    Lấy thông tin chi tiết một công việc bất kỳ (mô tả, ngày hạn, người phụ trách, công việc cha, tiến độ).
    - work_package_id: ID công việc cần xem.
    """
    res = op_request(f"/work_packages/{work_package_id}")
    if "error" in res:
        return f"Lỗi: {json.dumps(res, ensure_ascii=False)}"
    
    wp = _parse_wp_item(res)
    wp["description"] = res.get("description", {}).get("raw", "")
    wp["createdAt"] = res.get("createdAt")
    wp["updatedAt"] = res.get("updatedAt")
    return json.dumps(wp, ensure_ascii=False, indent=2)


@mcp.tool()
def list_available_statuses() -> str:
    """Tra cứu các trạng thái công việc được phép dùng trong dự án QLDAPM."""
    available = [
        {"name": "To Do", "description": "Công việc mới hoặc chuẩn bị làm"},
        {"name": "Dev in progress", "description": "Đang tiến hành lập trình"},
        {"name": "BA in progress", "description": "Đang phân tích nghiệp vụ / thiết kế"},
        {"name": "BA Review", "description": "BA đang review tài liệu / yêu cầu"},
        {"name": "In review", "description": "Đang được review code hoặc tài liệu"},
        {"name": "Ready for test", "description": "Đã dev xong, sẵn sàng để tester kiểm thử"},
        {"name": "Testing", "description": "Đang trong quá trình kiểm thử"},
        {"name": "Rework", "description": "Bị trả lại để sửa lại lỗi"},
        {"name": "Done", "description": "Công việc đã hoàn thành"},
        {"name": "Closed", "description": "Đã đóng hoàn tất"}
    ]
    return json.dumps(available, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    mcp.run()
