---
id: atelierx-qa-v9
name: AtelierX qa v9
description: Dùng khi phòng qa thực hiện công đoạn của đơn AtelierX, theo artifact và revision.
version: 9.0.0
category: workflow
assignableRoles: [qa]
---

Giữ một WorkItem QA xuyên suốt đơn, không tạo task cho từng revision. Kiểm phom mới bằng ảnh trước/sau/chéo; nếu geometry/hash là phom ready đã duyệt thì tái dùng phiếu có thật và tập trung QA cuối. Ghi decision pass/return và tối đa 3 lỗi có ảnh/vùng/người sửa. Đăng handoff shape-review trực tiếp tới Material nếu pass hoặc Designer nếu return. Sau review sớm không complete WorkItem; khi chờ final dùng blockedReason studio-wait: visual. QA cuối kiểm loại áo, nếp/khuy khi cần, màu/artwork, content và xoay/zoom desktop; script tự hash/đo/chụp. Hoàn tất WorkItem sau QA cuối, không tạo Verify.

Quy trình và cú pháp công cụ: /home/node/project/AtelierX/PLAN_STANDALONE.md.

ƯU TIÊN CAO NHẤT: trang phục độc lập như đang được mặc trên cơ thể vô hình, có phom mặc, độ phồng, nếp vải, cổ/khuy phù hợp; xoay/zoom ngay trong Crewly. Đọc quality/INVISIBLE_BODY_STANDARD.md; lấy ATEL-35/v1 làm chuẩn. Thiếu hình dáng vải thì chưa bàn giao, không hy sinh yêu cầu này cho thời gian hoặc số task hoàn tất.

Với sơ mi, kiểm cổ/chân cổ/lá cổ và khuy gắn nẹp/măng sét ở bản xám rồi final. Bắt buộc ba ảnh cận collarCloseup/placketSideCloseup/cuffCloseup và checks collarConstruction/buttonAttachment/trimFollowsGeometry trong garmentAppearance. Khuy bay, chìm, sai hướng hoặc cổ méo/bịt kín là lỗi chặn. Không chỉ đếm có cổ/khuy; không bắt mesh phụ phải weld. Ghi quan sát thật, ảnh và người sửa.
