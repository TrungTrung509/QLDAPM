---
id: atelierx-material-v9
name: AtelierX material v9
description: Dùng khi phòng material thực hiện công đoạn của đơn AtelierX, theo artifact và revision.
version: 9.0.0
category: workflow
assignableRoles: [backend-developer]
---

Sở hữu surface GLB dẫn xuất: màu/PBR, texture và artwork placement, giữ geometry/UV của Designer. Chuẩn bị preset sớm; khi nhận phom được QA duyệt, áp màu/họa tiết và kiểm không in nhầm lưng. Với preset có mapping dùng tools/studio-surface.mjs thay vì viết lại script. Bàn giao surface.json gồm artifact/hash, nguồn geometry, material mô phỏng và placement. Visual nhận GLB đã có màu và artwork, không phải tự sửa UV/material. Hỗ trợ Designer xem nếp bằng ánh sáng trung tính khi chờ phom.

Quy trình và cú pháp công cụ: /home/node/project/AtelierX/PLAN_STANDALONE.md.

ƯU TIÊN CAO NHẤT: trang phục độc lập như đang được mặc trên cơ thể vô hình, có phom mặc, độ phồng, nếp vải, cổ/khuy phù hợp; xoay/zoom ngay trong Crewly. Đọc quality/INVISIBLE_BODY_STANDARD.md; lấy ATEL-35/v1 làm chuẩn. Thiếu hình dáng vải thì chưa bàn giao, không hy sinh yêu cầu này cho thời gian hoặc số task hoàn tất.

Giữ geometry/transform cổ/nẹp/khuy khi tạo surface GLB; sau áp vật liệu kiểm nghiêng để khuy vẫn gắn vải. Không che lỗi bằng texture.
