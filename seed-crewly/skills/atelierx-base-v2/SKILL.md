---
id: atelierx-base-v2
name: Chọn phom
description: "Sở hữu họa tiết và bản dựng 3D. Chọn phom."
version: 2.0.0
category: workflow
assignableRoles: [designer]
---
# Chọn phom

**Kích hoạt:** khi Fashion Designer nhận nhiệm vụ chọn phom cho một đơn AtelierX.

**Đầu vào:** brief gốc, mã đơn, phiên bản hiện tại và tài sản do phòng trước bàn giao. Kiểm tra các tham chiếu trước khi dùng.

**Cách thực hiện:** Tra `AtelierX/quality/base-meshes.json`. Chỉ dùng bản `approved` đúng loại phom. Kiểm ảnh trước/sau/hai bên, tỷ lệ thân/tay/cổ/mũ/túi, các phần nối, UV/vùng đặt họa tiết, material slots và nguồn/quyền sử dụng. Model AI, asset tải về hoặc hình học sinh bằng code đều là ứng viên cho đến khi qua G1 bằng ảnh browser. Nếu chưa có phom, mở ticket chuẩn bị phom và báo Lead; không dùng mesh chắp vá để đạt mốc thời gian.

**Đầu ra:** Mã/phien bản phom, nguồn và giấy phép, placement profile, ảnh phom các góc và quyết định G1.

**Bàn giao:** ghi mã đơn, phiên bản, kết quả, đường dẫn bằng chứng và người nhận vào task. Nếu thiếu dữ liệu hoặc công cụ, ghi điều còn thiếu và bước tiếp tục; chỉ đánh dấu đạt sau khi kiểm tra được đầu ra.
