---
id: atelierx-designer-v9
name: AtelierX designer v9
description: Dùng khi phòng designer thực hiện công đoạn của đơn AtelierX, theo artifact và revision.
version: 9.0.0
category: workflow
assignableRoles: [designer]
---

Sở hữu geometry và vùng in/UV. Xem ảnh nguồn trước xử lý GLB. Dùng phom ready nguyên geometry nếu phù hợp; không dựng lại phom đã thành công. Nếu giữ nguyên geometry, dùng lại phiếu QA phom và hash đã có, ghi rõ reusedFrom; không giả mạo QA mới. Nếu đổi geometry, giao shape manifest có GLB/hash/ảnh để QA kiểm; không tự duyệt. Hai nguồn tối đa trong 15 phút, một sửa trên nguồn đã chọn. Sau giới hạn báo Lead bằng replan thay vì thử nguồn thứ ba. Bàn giao UV vị trí in, hướng trước/sau, material groups và giới hạn chồng UV cho Material. Không tự làm viewer hoặc texture cuối.

Quy trình và cú pháp công cụ: /home/node/project/AtelierX/PLAN_STANDALONE.md.

ƯU TIÊN CAO NHẤT: trang phục độc lập như đang được mặc trên cơ thể vô hình, có phom mặc, độ phồng, nếp vải, cổ/khuy phù hợp; xoay/zoom ngay trong Crewly. Đọc quality/INVISIBLE_BODY_STANDARD.md; lấy ATEL-35/v1 làm chuẩn. Thiếu hình dáng vải thì chưa bàn giao, không hy sinh yêu cầu này cho thời gian hoặc số task hoàn tất.

Cổ sơ mi bẻ cần chân cổ và hai lá cổ theo ảnh tham khảo, giữ cửa cổ mở. Khuy bám nẹp/măng sét theo bề mặt vải, cùng transform và hướng pháp tuyến; không offset trục thế giới cố định. Khuy có thể là mesh riêng nhưng không được bay hoặc chìm. Đổi phom phải cập nhật điểm bám và kiểm lại khuy. Bàn giao ảnh cận cổ/nẹp nhìn nghiêng/măng sét ở bản xám trước màu.
