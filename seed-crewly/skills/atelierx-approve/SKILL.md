---
id: atelierx-approve
name: Duyệt và bàn giao mẫu
description: Lead kiểm cùng revision của brief, model, viewer và QA trước khi đóng đơn.
version: 2.0.0
category: workflow
assignableRoles: [team-leader]
---
# Duyệt và bàn giao mẫu

Đọc `atelierx-flow`. Đối chiếu brief với màu, loại áo, họa tiết, vị trí in, góc mặc định và ảnh trước/sau. Mở URL viewer thực, kiểm GLB tải và xoay được. So revision của GLB, viewer, ảnh và phiếu QA; chúng phải trùng nhau. Nếu chưa thể kiểm trong trình duyệt, nêu giới hạn kiểm chứng và để trạng thái chưa duyệt.

Lỗi thuộc file nào trả về chủ file đó bằng ticket sửa nhỏ, giữ các phòng khác tiếp tục. Sau khi QA xác nhận bản sửa, đóng từng ticket con rồi ticket cha. Bàn giao bằng tiếng Việt trong thread đơn với tên mẫu, revision, URL mở được, các điểm đã kiểm và giới hạn còn lại. Không nói “ảnh ở trên” nếu không có ảnh đính kèm.
