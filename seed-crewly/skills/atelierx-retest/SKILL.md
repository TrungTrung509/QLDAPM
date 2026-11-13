---
id: atelierx-retest
name: Nghiệm thu bản sửa
description: "Kiểm độc lập trên bản viewer thực. Nghiệm thu bản sửa."
version: 1.0.0
category: workflow
assignableRoles: [qa]
---
# Nghiệm thu bản sửa

**Kích hoạt:** khi Technical Designer / QA nhận nhiệm vụ nghiệm thu bản sửa cho một đơn AtelierX.

**Đầu vào:** brief gốc, mã đơn, phiên bản hiện tại và tài sản do phòng trước bàn giao. Kiểm tra các tham chiếu trước khi dùng.

**Cách thực hiện:** Mở chính revision sửa, lặp lại bước gây lỗi rồi kiểm các nét chính đã đạt ở vòng trước. Không dùng ảnh cache của bản cũ.

**Đầu ra:** Phiếu QA đạt hoặc trả sửa, gắn revision.

**Bàn giao:** ghi mã đơn, phiên bản, kết quả, đường dẫn bằng chứng và người nhận vào task. Nếu thiếu dữ liệu hoặc công cụ, ghi điều còn thiếu và bước tiếp tục; chỉ đánh dấu đạt sau khi kiểm tra được đầu ra.
