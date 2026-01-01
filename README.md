# 📝 Minimalist Note Share

Một ứng dụng ghi chú siêu tối giản (Minimalist), bảo mật và tập trung vào trải nghiệm người dùng. Mỗi URL là một ghi chú riêng biệt, không cần đăng ký tài khoản.



## ✨ Tính năng nổi bật

* **Zero Login**: Không cần tài khoản. Truy cập bất kỳ đường dẫn nào (VD: `/hop-nhom`) để tạo ghi chú.
* **Auto-save**: Tự động lưu nội dung ngay khi bạn ngừng gõ (Debounce 1.2s).
* **Bảo mật thực thụ (Server-side)**: Dữ liệu bị khóa sẽ **không được gửi** về trình duyệt cho đến khi nhập đúng mật khẩu.
* **Giao diện Deep Dark**: Tông màu Slate/Zinc sang trọng, hỗ trợ đổi Theme (Light/Dark) và ghi nhớ tùy chọn.
* **Admin Power**: Master Password cho phép Admin mở khóa và gỡ mật khẩu vĩnh viễn cho bất kỳ ghi chú nào.
* **No Alerts**: Trải nghiệm mượt mà với Custom Modals và Toast Notifications thay thế cho các thông báo mặc định.

## 🛠 Công nghệ sử dụng

* **Backend**: Node.js & Express.
* **Database**: SQLite (Lưu trữ file cục bộ, gọn nhẹ).
* **Frontend**: Vanilla JS (ES6+), CSS Modern (Glassmorphism).
* **DevOps**: Docker, Docker Compose.



## 🚀 Hướng dẫn cài đặt

### Cách 1: Triển khai bằng Docker (Khuyên dùng cho Coolify/VPS)

1.  **Clone dự án:**
    ```bash
    git clone [https://github.com/your-username/mini-note.git](https://github.com/your-username/mini-note.git)
    cd mini-note
    ```

2.  **Chạy Docker Compose:**
    ```bash
    docker-compose up -d
    ```

### Cách 2: Chạy trực tiếp với Node.js

1.  Cài đặt thư viện: `npm install`
2.  Khởi chạy: `node server.js`
3.  Truy cập: `http://localhost:3001`

## 🔐 Cấu hình biến môi trường (Environment Variables)

Bạn có thể thay đổi các tham số sau trong file `docker-compose.yml`:

| Biến | Mô tả | Mặc định |
| :--- | :--- | :--- |
| `MASTER_PASSWORD` | Mật khẩu tối cao của Admin | `admin123` |
| `DB_PATH` | Đường dẫn lưu file Database | `/app/data/notes.db` |
| `NODE_ENV` | Chế độ chạy ứng dụng | `production` |

## 📂 Cấu trúc thư mục

* `server.js`: Logic xử lý API và xác thực bảo mật.
* `public/index.html`: Giao diện người dùng và logic đồng bộ.
* `.gitignore` & `.dockerignore`: Các file cấu hình loại bỏ rác khi upload và build.
* `data/`: Thư mục lưu trữ Database (vui lòng backup thư mục này).

## 🛡 Bảo mật

Ứng dụng sử dụng cơ chế **Double-Verify**:
1.  Kiểm tra quyền truy cập tại Server trước khi nhả nội dung.
2.  Mật khẩu Admin (Master Password) được verify lại mỗi khi thực hiện lệnh gỡ khóa vĩnh viễn.

---
Được phát triển với ❤️ để tối ưu hóa việc ghi chép nhanh.
