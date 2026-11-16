---
id: atelierx-recover
name: Khôi phục tiến độ
description: Xử lý vướng mắc theo phạm vi ảnh hưởng, chọn phương án thay thế và đồng bộ ticket với WorkItem.
version: 2.0.0
category: workflow
assignableRoles: [team-leader]
---
# Khôi phục tiến độ

Đọc `atelierx-flow`. Xác định ticket, WorkItem, revision, agent, lỗi thực tế và sản phẩm đã có. Phân biệt lỗi model, artwork, viewer, môi trường trình duyệt và thông số sản xuất áo thật. Thông số may/UV kích thước sản xuất không chặn mockup số nếu brief không yêu cầu.

Giữ các phòng độc lập chạy. Nếu GLB cuối chưa có, Viewer hoàn thiện UI bằng model thử. Nếu CDN hoặc browser automation lỗi, dùng asset cục bộ hoặc kiểm trong trình duyệt đang có; ghi rõ mức kiểm chứng. Nếu material spec thiếu dữ liệu vật lý, chọn preset PBR số hợp lý và ghi giả định. Chỉ retry bước lỗi với cùng mã đơn, không chạy lại toàn bộ pipeline.

Sau phương án thay thế, kiểm lại đầu ra. Nếu vẫn chặn, ghi lỗi, cách đã thử, phạm vi ảnh hưởng, người xử lý và bước tiếp theo vào ticket và thread; chuyển trạng thái hoặc giao lại. Không để ticket `in_progress` treo khi WorkItem đã `blocked`/`done`. Không báo hoàn tất chỉ vì file tồn tại khi URL viewer chưa hoạt động.

Chống deadlock: rà `ready` chưa giao, `running` mà agent idle, heartbeat **và log/đầu ra** đều cũ quá 2 phút, và `blocked` có phần độc lập còn làm được. Thu hồi claim treo, chuyển ticket về ready, giao đúng chủ file một lần; xác nhận WorkItem mới thật sự được nhận. Ticket cha chỉ do Lead sở hữu. Không để lỗi browser hoặc một phòng khác khóa các phần asset/HTML/HTTP đã làm được. Tách QA browser khỏi việc đưa bản nháp `preview` lên Sàn trưng bày Crewly; không lặp retry giống nhau hoặc sinh hàng dài review WorkItem. Không coi Sites/hosting là điều kiện của đơn.
