---
id: atelierx-showcase
name: Viewer sản phẩm trên web
description: Dựng viewer trước bằng mẫu thử rồi tích hợp GLB được duyệt và kiểm URL.
version: 2.0.0
category: workflow
assignableRoles: [frontend-developer]
---
# Viewer sản phẩm trên web

Đọc `atelierx-flow`. Bắt đầu từ mã đơn và brief, dùng GLB mẫu để dựng viewer ngay. Có trạng thái tải/lỗi, điều khiển xoay và zoom, nền giúp nhìn áo đen, chỗ thay GLB và nhãn revision. Giữ file viewer riêng; không sửa GLB hoặc material spec của phòng khác. Chép viewer và các asset cần thiết vào `/home/node/project/AtelierX/showcase/products/ATEL-n/vN/`; đường dẫn tương đối phải tải được từ cùng web Crewly. CSP của Crewly chỉ cho script cùng origin: dùng `/atelierx-products/assets/model-viewer.min.js` và script logic ở file `/atelierx-products/assets/viewer.js`; không dùng CDN hoặc JavaScript nhúng.

Khi Designer bàn giao GLB, thay nguồn model, ảnh trước/sau và metadata cùng revision; không chờ các báo cáo không ảnh hưởng viewer. Nếu CDN không tải, dùng gói cục bộ. Kiểm source, manifest và local HTTP; khi các phần này đạt, đóng ticket **tích hợp Viewer** và bàn giao rõ phần browser chưa kiểm cho ticket QA riêng. Build thành công một mình chưa đủ. Không để thiếu browser runner giữ phòng Viewer bị chặn sau khi phần tích hợp đã có bằng chứng.

Bàn giao đường dẫn nội bộ `/atelierx-products/products/ATEL-n/vN/index.html`, revision, kết quả kiểm model và vấn đề còn lại trong thread đơn. Báo Lead cập nhật `showcase/catalog.json` với `preview` trước QA, `complete` chỉ sau QA. Gửi QA đường dẫn để kiểm độc lập. Không deploy ra bên ngoài.
