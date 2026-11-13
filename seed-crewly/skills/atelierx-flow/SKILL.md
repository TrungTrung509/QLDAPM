---
id: atelierx-flow
name: Quy trình song song AtelierX
description: Hợp đồng chung về ticket, phụ thuộc, quyền sở hữu, bàn giao và xử lý vướng mắc cho sáu agent.
version: 2.0.0
category: workflow
---
# Quy trình song song AtelierX

Đọc `/home/node/project/AtelierX/.crewly/knowledge/operating-model.md` trước khi làm đơn. Sản phẩm cần bàn giao là áo số 3D xem được trên web; thông số sản xuất thật chỉ làm khi được yêu cầu.

1. Mỗi đơn có ticket cha và ticket con cho các phòng. Agent chỉ nhận việc khi ticket đã được giao thật và có WorkItem. Tin chat trên `#general` AtelierX là nhật ký và trao đổi, không thay thế việc giao ticket.
2. Researcher, Material Specialist, Designer và Visual Studio bắt đầu từ brief cùng lúc. Designer dựng phom trước khi nhận art direction; Visual Studio dựng viewer với model thử trước khi nhận GLB cuối. QA chuẩn bị checklist sớm, kiểm bản nháp khi có GLB. Chỉ phần phụ thuộc mới chờ.
3. Mỗi người giữ file thuộc phạm vi của mình. Researcher: hướng minh họa. Material Specialist: material spec số. Designer: model, artwork, texture, GLB. Visual Studio: viewer và tích hợp. QA: phiếu kiểm. Lead: brief, phân công, duyệt. Muốn sửa file người khác thì gửi patch hoặc yêu cầu; một người được chỉ định áp dụng.
4. Mỗi bàn giao ghi mã đơn/ticket, revision, đường dẫn file hoặc URL, kết quả đã kiểm, việc còn thiếu và người nhận. Đăng trong thread đơn; báo thay đổi quan trọng cho Lead. Không ghi “xong” khi thiếu bằng chứng.
5. Gặp chặn thì nêu lỗi cụ thể và thử ngay một phương án phù hợp với mockup số. Nếu vẫn chặn, cập nhật ticket/WorkItem đúng trạng thái, báo Lead và làm việc độc lập kế tiếp. Không giữ ticket `in_progress` khi WorkItem `done` hoặc `blocked` mà không giải thích.
6. Chỉ công bố hoàn thành khi GLB, viewer và QA là cùng revision, URL mở được, áo có đúng màu/họa tiết/vị trí và xoay được. Tất cả trao đổi và bàn giao bằng tiếng Việt có dấu.
