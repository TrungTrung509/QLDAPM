# 🧵 AtelierX — Hướng dẫn triển khai nhóm trên Crewly Docker

Tài liệu này dành cho các thành viên trong nhóm để **clone và khởi chạy toàn bộ Xưởng Thiết kế Thời trang Số AtelierX** trên nền tảng Crewly một cách nhanh chóng, đồng bộ và không gặp lỗi.

---

## 🌟 Những gì đã được đóng gói sẵn trong repo này

Khi bạn hoặc bất kỳ thành viên nào clone gói Docker này về, hệ thống sẽ có sẵn 100%:

1. **Không gian Xưởng thời trang 3D (AtelierX Studio):**
   - Mô phỏng trực quan 6 khu vực làm việc: Bàn Điều phối, Bảng Nghiên cứu xu hướng, Bàn Thiết kế & CAD, Kệ Vải & Vật liệu, Bàn Kỹ thuật may, Studio Lookbook và Sàn Catwalk trưng bày mẫu 3D.
   - **Giám sát Token & Quota thời gian thực:** Trực quan hóa ngay trên đầu từng Agent trạng thái pin `[🟢 Còn token]` hoặc `[🔴 Hết token]` để cả nhóm nắm bắt tiến độ và năng lượng của Agent.
2. **Đội ngũ 6 Fashion Studio Agents:**
   - 👑 **Studio Lead (Trưởng xưởng / Điều phối):** Lập brief bộ sưu tập, giao việc theo chặng và duyệt hồ sơ bàn giao.
   - 🔍 **Market & Trend Researcher:** Nghiên cứu thị trường, bảng màu xu hướng và phân tích đối thủ.
   - 🎨 **Fashion Designer:** Sáng tạo phác thảo 2D và dựng mô hình 3D mẫu trang phục.
   - 📐 **Technical Designer / QA:** Lập bảng thông số kỹ thuật nhảy size (Grading), lập Tech Pack và kiểm định chất lượng rập may.
   - 🧵 **Merchandiser / Material Specialist:** Quản lý thư viện vải, tính định mức nguyên phụ liệu (BOM) và chi phí giá thành.
   - 📸 **Brand & Commerce / Visual Studio:** Chuẩn bị layout lookbook, trang sản phẩm và nội dung ra mắt thị trường.
3. **Kỹ năng nghiệp vụ (AtelierX Skills):** Bộ skill thời trang chuyên biệt đã được tự động nạp vào Crewly.
4. **Không cần cài đặt phức tạp:** Mọi thứ từ Node.js, AI harnesses, Three.js, bundle giao diện đã được đóng gói sẵn trong Docker.

---

## 🚀 Hướng dẫn khởi chạy nhanh (Dành cho thành viên mới)

> **Yêu cầu duy nhất:** Máy tính đã cài đặt **Docker Desktop** (chạy trên Windows, macOS hoặc Linux).

### Bước 1: Clone mã nguồn về máy
Mở Terminal hoặc PowerShell và chạy:
```bash
git clone https://github.com/TrungTrung509/QLDAPM.git crewly-docker
cd crewly-docker
```

### Bước 2: Khởi động hệ thống
Chạy lệnh duy nhất sau để Docker tự động dựng và khởi chạy môi trường:
```bash
docker compose up -d --build
```

*(Lưu ý: Bạn **KHÔNG BẮT BUỘC** phải có file `.env` hay `GEMINI_API_KEY` thì hệ thống mới chạy được. Docker sẽ khởi chạy bình thường với cấu hình mặc định sẵn có).*

### Bước 3: Mở trình duyệt sử dụng
- Truy cập vào đường dẫn: **[http://localhost:8787](http://localhost:8787)**
- Nhấn vào tab **AtelierX Studio** để xem không gian xưởng thiết kế 3D, trạng thái làm việc và mức token của từng Agent.

---

## 🔄 Quy trình làm việc nhóm & Đồng bộ mã nguồn

### Khi bạn kéo cập nhật mới của đồng đội về:
Mỗi khi có thành viên khác trong nhóm push thay đổi (sửa giao diện, sửa skill, sửa logic) lên GitHub, bạn chỉ cần thực hiện 2 bước:
```bash
# 1. Kéo mã nguồn mới nhất về
git pull

# 2. Đóng gói lại container để áp dụng ngay code mới
docker compose up -d --build
```
> Sau đó vào lại trình duyệt `http://localhost:8787` nhấn **F5** (hoặc `Ctrl + F5`) để tải giao diện mới.

### Khi bạn muốn sửa và đẩy thay đổi lên cho nhóm:
```bash
# 1. Kéo bản mới nhất trước khi làm việc
git pull

# 2. Sửa file và kiểm tra cục bộ bằng:
docker compose up -d --build

# 3. Đẩy lên GitHub cho cả nhóm
git add .
git commit -m "feat: cập nhật mô tả công việc hoặc giao diện xưởng"
git push origin main
```

---

## 📌 Các lệnh quản trị hữu ích

| Lệnh | Chức năng |
| :--- | :--- |
| `docker compose up -d` | Khởi động container (không build lại) |
| `docker compose up -d --build` | Khởi động và build lại image với code mới |
| `docker compose logs -f crewly` | Xem log hoạt động thời gian thực của các Agent |
| `docker compose restart` | Khởi động lại hệ thống |
| `docker compose down` | Dừng và tắt container |
| `docker compose down -v && docker compose up -d --build` | **Reset trắng dữ liệu:** Xóa toàn bộ volume cũ và nạp lại từ đầu từ cấu hình gốc |
