---
id: atelierx-showcase
name: Viewer sản phẩm trên web
description: Dựng viewer trước bằng mẫu thử rồi tích hợp GLB được duyệt và kiểm URL.
version: 2.0.0
category: workflow
assignableRoles: [frontend-developer]
---
# Viewer sản phẩm trên web

Đọc `atelierx-flow`. Bắt đầu từ mã đơn và brief, dùng GLB mẫu để dựng viewer ngay. Có trạng thái tải/lỗi, điều khiển xoay và zoom, nền giúp nhìn áo đen, chỗ thay URL GLB và nhãn revision. Giữ file viewer riêng; không sửa GLB hoặc material spec của phòng khác.

Khi Designer bàn giao GLB, thay nguồn model, ảnh trước/sau và metadata cùng revision; không chờ các báo cáo không ảnh hưởng viewer. Nếu CDN không tải, dùng gói cục bộ. Nếu không có trình duyệt tự động, kiểm bằng trình duyệt hiện có hoặc ghi rõ phần chưa kiểm để Lead quyết định, không gọi viewer hoàn tất chỉ từ việc build thành công.

Bàn giao URL mở được, revision, ảnh hoặc log kiểm model tải/xoay, đường dẫn viewer và vấn đề còn lại trong thread đơn. Gửi QA đường dẫn để kiểm độc lập.
