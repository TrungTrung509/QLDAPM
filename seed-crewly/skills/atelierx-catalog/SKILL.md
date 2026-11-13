---
id: atelierx-catalog
name: Danh mục vật liệu
description: "Quản lý vật liệu số và tính tương thích của phom. Danh mục vật liệu."
version: 1.0.0
category: workflow
assignableRoles: [backend-developer]
---
# Danh mục vật liệu

**Kích hoạt:** khi Merchandiser / Material Specialist nhận nhiệm vụ danh mục vật liệu cho một đơn AtelierX.

**Đầu vào:** brief gốc, mã đơn, phiên bản hiện tại và tài sản do phòng trước bàn giao. Kiểm tra các tham chiếu trước khi dùng.

**Cách thực hiện:** Đối chiếu asset có thật, quyền dùng, tên material slot, texture và phom tương thích. Tách mục đang thiếu khỏi mục có thể dùng.

**Đầu ra:** Danh mục tham chiếu kèm phiên bản.

**Bàn giao:** ghi mã đơn, phiên bản, kết quả, đường dẫn bằng chứng và người nhận vào task. Nếu thiếu dữ liệu hoặc công cụ, ghi điều còn thiếu và bước tiếp tục; chỉ đánh dấu đạt sau khi kiểm tra được đầu ra.
