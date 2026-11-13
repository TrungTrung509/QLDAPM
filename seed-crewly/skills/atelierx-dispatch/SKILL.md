---
id: atelierx-dispatch
name: Giao việc song song
description: Lead tạo ticket và WorkItem thật cho từng phòng, xác nhận người nhận và phụ thuộc.
version: 2.0.0
category: workflow
assignableRoles: [team-leader]
---
# Giao việc song song

Đọc `atelierx-flow` và operating model. Trong 2 phút sau brief, chốt phần khách để mở, đặt mã đơn và revision, tạo ticket cha. Tạo ticket con riêng cho Researcher, Material Specialist, Designer, Visual Studio và QA; mô tả đầu ra, file sở hữu, điều kiện bắt đầu, người nhận và tiêu chí đạt. Không gộp hết vào Designer.

Chuyển từng ticket con từ `backlog` sang `ready`, dùng `skill-assign-ticket` để giao cho đúng agent. Kiểm tra assignee, ticket `in_progress` và WorkItem đã tạo. Nếu bước giao thất bại, xử lý hoặc báo rõ; bài đăng channel không chứng minh agent đã nhận việc.

Giao Researcher, Material Specialist, Designer và Visual Studio cùng lúc từ brief. QA chuẩn bị checklist ngay; chỉ việc kiểm bản nháp phụ thuộc vào GLB. Không tạo chuỗi chờ Researcher → Material → Designer → Viewer. Ghi các mốc giao sản phẩm, revision và link thread trên `#general` AtelierX.

Khi nhận bàn giao, chỉ mở ticket sửa cho phần sai và đúng chủ file. Đối chiếu ticket với WorkItem; WorkItem `done` cần Lead kiểm đầu ra rồi mới đóng ticket, WorkItem `blocked` cần chuyển/reassign đúng trạng thái. Giữ ticket cha mở tới khi viewer và QA đạt cùng revision.
