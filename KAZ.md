# KAZ AI Video Factory V7

Mở **Actions → KAZ Remotion Preview → Run workflow**. Chọn tên tập, ví dụ `demo`. Sau khi kiểm tra thành công, tải MP4 trong mục **Artifacts**.

Tạo tập mới bằng cách sao chép `episodes/demo.json` sang tên khác trong thư mục `episodes`. Mỗi tập gồm một cảnh mở, năm ví dụ và một cảnh kết. Điền lời đọc, tiêu đề và ví dụ cho từng cảnh. Có thể thêm `"image": {"file": "ten-anh.jpg", "credit": "Tên nguồn"}` và đặt ảnh cạnh JSON. Chỉ đưa nội dung có quyền sử dụng lên kho công khai. Ảnh mặc định là đồ họa của bản thử.

Remotion dựng MP4 dọc 1080 × 1920 trên máy chạy Ubuntu tiêu chuẩn. eSpeak NG đọc tiếng Việt trong bản thử. Mốc karaoke của bản thử được chia theo thời lượng cảnh. Mốc và giọng bản thử có thể khác bản gốc.

Lịch mục tiêu tính theo giờ Việt Nam.

| Khung | Mốc |
| --- | --- |
| Sáng sớm | 06:15, 06:45, 07:15, 07:45 |
| Sáng | 10:15, 10:45, 11:15, 11:45 |
| Chiều | 16:15, 16:45, 17:15, 17:45 |
| Tối | 19:07, 19:22, 19:37, 19:52 |
| Tối muộn | 20:15, 20:45, 21:15, 21:45 |

Lịch đã có kiểm thử. Bản hiện tại chỉ dựng và xuất video. Đăng thật cần quyền OAuth của kênh YouTube, quyền đăng bằng Page access token của Facebook Page và luồng lưu ID bài đăng. Nhập thông tin bí mật riêng trong **Settings → Secrets and variables → Actions**.

