---
id: atelierx-approve-v3
name: Duyệt và bàn giao mẫu
description: Lead kiểm cùng revision của brief, model, viewer và QA trước khi đóng đơn.
version: 3.0.0
category: workflow
assignableRoles: [team-leader]
---
# Duyệt và bàn giao mẫu

Đọc `atelierx-flow-v3` và `atelierx-quality`. Đối chiếu brief với màu, loại áo, họa tiết, vị trí in, góc mặc định và ảnh browser đủ góc. Mở Sàn trưng bày ngay trong Crewly, chọn sản phẩm và kiểm GLB tải, xoay được. So revision của catalog, GLB, viewer, ảnh và phiếu QA; chúng phải trùng nhau. Chạy `cd /home/node/project/AtelierX && node tools/quality-gate.mjs --product ATEL-N` rồi `--publish` khi đã tự xem ảnh và duyệt. Gate chỉ kiểm tính đầy đủ/nhất quán; Lead vẫn phải tự nhìn ảnh để duyệt thẩm mỹ. Nếu chưa thể kiểm trong trình duyệt hoặc thiếu phom approved, giữ catalog ở `preview` và đơn ở trạng thái chưa duyệt.

Lỗi thuộc file nào trả về chủ file đó bằng ticket sửa nhỏ, giữ các phòng khác tiếp tục. Sau khi QA xác nhận bản sửa và gate pass, đổi catalog sang `complete`, đóng từng ticket con rồi ticket cha. Đăng quyết định và bàn giao bằng tiếng Việt trong **thread team của đơn** qua `atelierx-channel-v3`, kiểm `messageId`; trả lời người dùng với tên mẫu, revision và cách mở Sàn trưng bày. Không yêu cầu Sites/deploy hay URL công khai. Không nói “ảnh ở trên” nếu không có ảnh đính kèm.
