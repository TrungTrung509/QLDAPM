# 🚀 HƯỚNG DẪN TRIỂN KHAI CREWLY DOCKER DÀNH CHO THÀNH VIÊN NHÓM

Gói Docker này đã được **đóng gói trọn gói (Self-contained)**. Bất kỳ thành viên nào trong nhóm khi clone về đều sẽ có:

1. **Giao diện chuẩn 100%**: Tab 🏢 **3D Virtual Office (Luxury Isometric)**, Tab Skills trong Settings, bảng chọn kỹ năng Additional Skills cho từng Agent.
2. **Đã ẩn hoàn toàn thông báo nâng cấp**: Không còn thông báo Update Available hay nút upgrade gây mất cấu hình.
3. **Cấu hình sẵn QLDA Team (7 Agents)**:
   - 👑 **Team Leader** (Điều phối, phân quyền, giao việc)
   - 📋 **Technical Product Manager** (Đặc tả yêu cầu BBS, phân tích kiến trúc)
   - 🎨 **UI UX Designer** (Thiết kế UI/UX)
   - 💻 **FE Developer** (Lập trình Frontend)
   - ⚙️ **BE Developer** (Lập trình Backend & SQLite)
   - 🌐 **Fullstack Developer** (Tích hợp luồng đặt lịch)
   - 🧪 **Tester (QA)** (Kiểm thử tự động & Báo cáo lỗi)
4. **Tích hợp sẵn 2 Custom Skills**:
   - `post-team-chat`: Agent tự động chat trao đổi vào kênh nhóm (#general), giao việc, handover, báo cáo hoàn thành.
   - `manage-ticket-spec`: Tạo & chuẩn hóa đặc tả Ticket theo định dạng chuẩn 5 phần.
5. **Tính di động đa nền tảng**: Chạy được trên cả **Windows, macOS, Linux** mà không bị lỗi đường dẫn cố định.

---

## 🛠 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY (CHỈ 3 BƯỚC)

### Bước 1: Chuẩn bị file môi trường `.env`

Trong thư mục `crewly-docker`, copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

_(Trên Windows PowerShell: `Copy-Item .env.example .env`)_

Mở file `.env` và điền:

- `GEMINI_API_KEY`: Key Gemini của bạn (lấy tại Google AI Studio).
- `GITHUB_TOKEN`: Personal Access Token GitHub (nếu cần cho Agent push code).

### Bước 2: Khởi động hệ thống bằng Docker Compose

Mở Terminal/PowerShell tại thư mục `crewly-docker` và chạy:

```bash
docker compose up -d --build
```

> Docker sẽ tự động:
>
> - Tải và cài đặt môi trường Crewly, Antigravity CLI.
> - Nạp bundle giao diện 3D Virtual Office.
> - Patch backend để tắt update banner.
> - Nạp sẵn 7 Agents và 2 Skills tùy biến vào Volume.

### Bước 3: Mở trình duyệt sử dụng

- Truy cập: **[http://localhost:8787](http://localhost:8787)**
- Bạn sẽ thấy:
  - Dự án **Barbershop-Booking-System** đã được nhận diện.
  - Team **QLDA Team** với 7 nhân sự đã sẵn sàng.
  - Tab **🏢 3D Office** hiển thị văn phòng 3D làm việc của các Agent.
  - 2 Skill tùy chỉnh hiển thị trong **Settings › Skills**.

---

## 📌 CÁC LỆNH QUẢN TRỊ CƠ BẢN

- **Xem log thời gian thực:**
  ```bash
  docker compose logs -f crewly
  ```
- **Dừng hệ thống:**
  ```bash
  docker compose down
  ```
- **Khởi động lại:**
  ```bash
  docker compose restart
  ```
- **Reset toàn bộ dữ liệu về trạng thái mặc định (nếu muốn làm mới hoàn toàn):**
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```
