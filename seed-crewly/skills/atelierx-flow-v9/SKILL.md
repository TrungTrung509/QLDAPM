---
id: atelierx-flow-v9
name: AtelierX flow v9
description: Điều phối đơn áo 3D độc lập theo artifact, chọn phom trước và bàn giao To review.
version: 9.0.0
category: workflow
---

Làm việc bằng tiếng Việt. PLAN_STANDALONE.md và studio flow v9 là quy trình hiện hành cho đơn mới; ATEL-23 đã dừng, chỉ làm khi owner gửi brief. Đích: áo 3D độc lập có khối/nếp và chi tiết đúng brief, viewer desktop trong Crewly, nội dung ngắn có vật liệu mô phỏng và số đo có nguồn. Mục tiêu 40–60 phút khi có phom phù hợp, 25–40 phút cho đổi màu/họa tiết đơn giản; đây là mục tiêu cần đo, không hứa khi thiếu phom. Một owner mỗi artifact; hình học Designer, surface Material, web Visual. Dùng node tools/studio-flow.mjs để đăng artifact và chuyển người nhận trong khoảng một chu kỳ watchdog; không chờ Lead chuyển lời. Một thread, NHẬN VIỆC và BÀN GIAO tối đa 5 dòng bằng session thật. Không tạo Verify/Retry/self-ping; title chỉ dùng tên ngắn từ tasks[role].title, GOAL/EXPECTED OUTCOME nằm trong description. Không đọc lại kế hoạch cũ. Chờ phụ thuộc dùng studio-wait: <stage>, quota/auth dùng lý do riêng. Đọc mục công cụ trong PLAN_STANDALONE.md khi cần cú pháp.

Quy trình và cú pháp công cụ: /home/node/project/AtelierX/PLAN_STANDALONE.md.

ƯU TIÊN CAO NHẤT: trang phục độc lập như đang được mặc trên cơ thể vô hình, có phom mặc, độ phồng, nếp vải, cổ/khuy phù hợp; xoay/zoom ngay trong Crewly. Đọc quality/INVISIBLE_BODY_STANDARD.md; lấy ATEL-35/v1 làm chuẩn. Thiếu hình dáng vải thì chưa bàn giao, không hy sinh yêu cầu này cho thời gian hoặc số task hoàn tất.

Sơ mi phải được duyệt cổ/khuy ở bản xám trước trang trí; yêu cầu ảnh cận collarCloseup, placketSideCloseup, cuffCloseup đúng revision. Khuy bay hoặc cổ sai cấu trúc là lỗi chặn.
