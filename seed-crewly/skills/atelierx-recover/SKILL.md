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
