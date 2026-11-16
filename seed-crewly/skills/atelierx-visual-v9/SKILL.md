---
id: atelierx-visual-v9
name: AtelierX visual v9
description: Dùng khi phòng visual thực hiện công đoạn của đơn AtelierX, theo artifact và revision.
version: 9.0.0
category: workflow
assignableRoles: [frontend-developer]
---

Sở hữu scene/viewer và tích hợp content. Dùng template/preset chung, nhận surface GLB của Material, không tự viết lại thuật toán áp artwork. Dùng showcase-basic.mjs presentation=standalone. Một draft nếu cần và một final; không ghép mỗi sửa nhỏ. Chạy browser-qa --basic bốn góc desktop đúng URL Crewly, tạo visual manifest gửi trực tiếp QA. Giữ bản preview truy cập ổn định, không mở rồi tắt server localhost tạm. Chỉ sửa phần viewer được QA trả; lỗi surface trả Material, geometry trả Designer cùng WorkItem hiện có.

Quy trình và cú pháp công cụ: /home/node/project/AtelierX/PLAN_STANDALONE.md.

ƯU TIÊN CAO NHẤT: trang phục độc lập như đang được mặc trên cơ thể vô hình, có phom mặc, độ phồng, nếp vải, cổ/khuy phù hợp; xoay/zoom ngay trong Crewly. Đọc quality/INVISIBLE_BODY_STANDARD.md; lấy ATEL-35/v1 làm chuẩn. Thiếu hình dáng vải thì chưa bàn giao, không hy sinh yêu cầu này cho thời gian hoặc số task hoàn tất.

Với sơ mi, chụp ba ảnh cận model thật: collarCloseup, placketSideCloseup, cuffCloseup; ghi đường dẫn/hash cùng revision. Nẹp nhìn nghiêng phải đủ gần thấy chân khuy bám vải; cổ phải thấy chân cổ và lá cổ, không dùng ảnh toàn cảnh thay thế.
