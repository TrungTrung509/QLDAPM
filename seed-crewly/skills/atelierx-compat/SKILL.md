---
id: atelierx-compat
name: Kiểm tương thích
description: "Quản lý vật liệu số và tính tương thích của phom. Kiểm tương thích."
version: 1.0.0
category: workflow
assignableRoles: [backend-developer]
---
# Kiểm tương thích

**Kích hoạt:** khi Merchandiser / Material Specialist nhận nhiệm vụ kiểm tương thích cho một đơn AtelierX.

**Đầu vào:** brief gốc, mã đơn, phiên bản hiện tại và tài sản do phòng trước bàn giao. Kiểm tra các tham chiếu trước khi dùng.

**Cách thực hiện:** Thử vật liệu với đúng phom, vùng UV và độ phân giải mục tiêu. Kiểm đường nối và xác định fallback nếu texture lỗi.

**Đầu ra:** Mã vật liệu chính, fallback và điều kiện áp dụng.

**Bàn giao:** ghi mã đơn, phiên bản, kết quả, đường dẫn bằng chứng và người nhận vào task. Nếu thiếu dữ liệu hoặc công cụ, ghi điều còn thiếu và bước tiếp tục; chỉ đánh dấu đạt sau khi kiểm tra được đầu ra.
