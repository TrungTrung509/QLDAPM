---
id: atelierx-channel
name: AtelierX Team Channel
description: Giao việc, nhận việc, thảo luận, bàn giao, QA và duyệt trong channel chung của AtelierX Fashion Studio.
version: 2.0.0
category: communication
execution:
  type: script
  script:
    file: execute.sh
    interpreter: bash
    timeoutMs: 30000
---
# Làm việc công khai trong AtelierX

Dùng `bash ~/.crewly/skills/atelierx-channel/execute.sh --content "nội dung"` từ chính session của mình. Với nội dung nhiều dòng dùng `--content-file`. Skill tự tìm phòng theo team ID. Giữ cùng thread bằng `--thread <id>` khi làm tiếp một đơn. Dùng `--cmid <id ổn định>` khi thử lại cùng một thông báo.

Người dùng đã yêu cầu team làm việc trên channel AtelierX. Lead đăng brief, tên người nhận, phạm vi, hạn và tiêu chí đạt trong thread đơn. Tạo ticket, chuyển `ready`, dùng `skill-assign-ticket` để giao và kiểm WorkItem; sau đó dùng delegate-task nếu cần đánh thức session với mã ticket, thread và messageId. Tin channel không tự tạo task hoặc kích hoạt tất cả đồng nghiệp. Khi cần phản hồi, đăng câu hỏi lên channel rồi gửi tham chiếu đến đúng agent.

Người nhận xác nhận trong channel, đăng câu trả lời, thay đổi quyết định, bằng chứng và lý do chờ ở đó. Mỗi người chỉ đăng khi có đầu ra, đổi revision hoặc blocker cụ thể. Designer bàn giao revision cho QA và Visual Studio. QA đăng kết quả theo revision. Lead đăng quyết định cuối. Không lặp lại tin đã gửi hoặc gửi lời chào vòng quanh. Nếu đăng thất bại báo lỗi; chỉ coi là đã đăng khi có messageId.
