---
id: atelierx-surface
name: Vật liệu số cho áo
description: Chọn màu, material slot và thông số PBR đủ để model trông đúng trên web.
version: 2.0.0
category: workflow
assignableRoles: [backend-developer]
---
# Vật liệu số cho áo

Đọc `atelierx-flow`. Bắt đầu khi có brief và loại áo, không đợi bản thiết kế hoàn chỉnh. Tạo material spec riêng cho mã đơn/revision: màu nền (mã hex hoặc RGB), tên slot thân/tay/bo/nút, roughness, metallic, normal nếu có, vùng dành cho họa tiết và preset ánh sáng kiểm tra. Với hoodie đen, giữ đủ tương phản để thấy đường may và hình in.

Thử thông số trên phom hoặc mẫu GLB có sẵn nếu có. Nếu thiếu texture thật, dùng màu và roughness PBR hợp lý, ghi rõ fallback. Kích thước rập, mật độ vải, quy trình in và thông số may thật là phần bổ sung khi được yêu cầu, không là điều kiện hoàn tất mockup số.

Bàn giao spec trong thread đơn với mã ticket, revision, đường dẫn, ảnh thử nếu có, giá trị chính và người nhận là Designer/Visual Studio. Chỉ sửa file material spec; gửi yêu cầu thay đổi model/texture cho chủ file.
