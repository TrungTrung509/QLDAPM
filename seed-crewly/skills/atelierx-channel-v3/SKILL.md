---
id: atelierx-channel-v3
name: AtelierX Team Channel
description: Giao việc, nhận việc, thảo luận, bàn giao, QA và duyệt trong channel chung của AtelierX Fashion Studio.
version: 3.0.0
category: communication
execution:
  type: script
  script:
    file: execute.sh
    interpreter: bash
    timeoutMs: 30000
---
# Làm việc công khai trong AtelierX

Dùng `bash ~/.crewly/skills/atelierx-channel-v3/execute.sh --content "nội dung"` từ **session agent của chính mình**. Với nội dung nhiều dòng dùng `--content-file`. Skill tự tìm channel đúng team ID, tự mở thread mới nếu chưa truyền `--thread`, và cho phép các mốc công việc nối tiếp trong cùng thread. Kết quả **phải có `messageId`**; nếu không có, báo lỗi cho Lead và thử lại. Dùng `--cmid <mã-đơn:revision:agent:mốc>` ổn định khi thử lại để tránh bài trùng.

Mỗi đơn có **một thread điều phối của team do Lead mở**, tách với thread chat riêng của người dùng. Lead đăng brief/mã đơn/revision và lưu `messageId` gốc vào ticket cha. Tạo ticket, chuyển `ready`, dùng `skill-assign-ticket` để giao và kiểm WorkItem; sau đó dùng delegate-task nếu cần đánh thức session với mã ticket, thread và messageId. Tin channel không tự tạo task hoặc kích hoạt tất cả đồng nghiệp. Khi cần phản hồi, đăng câu hỏi lên thread team rồi gửi tham chiếu đến đúng agent bằng kênh giao việc thực.

**Mốc bắt buộc, không đăng cho có:**

1. Lead mở thread, rồi sau khi WorkItem thật đã chạy đăng `GIAO VIỆC` với mã ticket và người nhận.
2. Mỗi agent đăng `NHẬN VIỆC` ngay khi claim WorkItem: mục tiêu, đầu ra sẽ nộp và việc có thể bắt đầu ngay. Lưu `messageId` vào ticket/WorkItem.
3. Khi có quyết định thiết kế ảnh hưởng người khác, blocker cụ thể hoặc revision mới, đăng `QUYẾT ĐỊNH`/`VƯỚNG MẮC` kèm người xử lý và bước tiếp theo; không cập nhật theo giờ nếu chưa có thông tin mới.
4. Khi đầu ra sẵn sàng, đăng `BÀN GIAO` với đường dẫn, revision, bằng chứng kiểm, người nhận tiếp theo. Gửi thông báo trực tiếp tới người nhận nếu cần đánh thức session; bài channel là nhật ký chung.
5. QA đăng `ĐẠT` hoặc `TRẢ LẠI` với ảnh browser và lỗi chính xác. Lead đăng `DUYỆT` hoặc `CHƯA DUYỆT` và trạng thái catalog; chỉ `DUYỆT` khi quality gate qua.

Mọi bài trong thread team bằng tiếng Việt có dấu. Không tự nhận vai người dùng để viết vào channel, không dùng `post-team-chat` vì skill đó mặc định trỏ channel QLDA. Nếu skill trả lỗi hoặc thiếu `messageId`, không tuyên bố đã thông báo; Lead xử lý sự cố channel trước khi kết thúc đơn.
