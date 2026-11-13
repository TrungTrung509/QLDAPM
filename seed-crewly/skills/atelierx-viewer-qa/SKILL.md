---
id: atelierx-viewer-qa
name: Kiểm viewer
description: "Kiểm độc lập trên bản viewer thực. Kiểm viewer."
version: 2.0.0
category: workflow
assignableRoles: [qa]
---
# Kiểm viewer

**Kích hoạt:** khi Technical Designer / QA nhận nhiệm vụ kiểm viewer cho một đơn AtelierX.

**Đầu vào:** brief gốc, mã đơn, phiên bản hiện tại và tài sản do phòng trước bàn giao. Kiểm tra các tham chiếu trước khi dùng.

**Cách thực hiện:** Chuẩn bị checklist từ brief khi chưa có GLB. Khi viewer có URL, mở luồng web thật trên desktop và viewport di động; kiểm tải texture, xoay, zoom, camera đầu và thao tác khi tải lỗi. Nếu browser automation trong runtime thiếu thư viện, thử browser sẵn có hoặc bàn giao bài kiểm cụ thể cho Lead; tiếp tục kiểm GLB, đường dẫn và HTTP độc lập. Không coi các kiểm tĩnh là bằng chứng render/xoay trong browser.

**Đầu ra:** Kết quả kèm revision, trình duyệt và bước tái hiện.

**Bàn giao:** ghi mã đơn, phiên bản, kết quả, đường dẫn bằng chứng và người nhận vào task. Nếu thiếu dữ liệu hoặc công cụ, ghi điều còn thiếu và bước tiếp tục; chỉ đánh dấu đạt sau khi kiểm tra được đầu ra.
