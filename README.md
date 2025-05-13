[Link Web Pulic](https://vjintageboy.github.io/software-testing-g2/?fbclid=IwZXh0bgNhZW0CMTEAAR4kdbqePu4txXnG8gtX4Ny_qsdHzr7UgKcSVeuTgnlH656DqhngMRqFQ5lRwA_aem_xITQ5LlDpBxpPGmpO0BJkg)
# BÁO CÁO KẾT QUẢ THỰC HIỆN CHỨC NĂNG 1: QUẢN LÝ BẰNG CẤP

**Môn học/Dự án:** Đánh giá và kiểm định chất lượng phần mềm - 1-3-24(N01.TH7)

**Đơn vị thực hiện:** Nhóm 02

## Thành viên nhóm

* Trịnh Hoài Nam
* Phạm Hoàng Anh (L)
* Nguyễn Đức Anh
* Hoàng Thị Thảo Nhi

## 1. Giới thiệu Dự án: Hệ thống Quản lý Thông tin Giáo viên

Hệ thống "Quản lý thông tin giáo viên" được xây dựng nhằm mục đích tin học hóa công tác quản lý hồ sơ, thông tin cá nhân, quá trình công tác, và các thông tin liên quan khác của đội ngũ giáo viên trong một cơ sở giáo dục. Hệ thống giúp giảm thiểu công việc giấy tờ, tăng tính chính xác, bảo mật và khả năng truy xuất thông tin nhanh chóng, hỗ trợ công tác báo cáo, thống kê và ra quyết định của ban lãnh đạo.

## 2. Mô tả Nhóm chức năng 1: Quản lý Bằng cấp

Đây là báo cáo chi tiết về việc thực hiện Nhóm chức năng 1: **Quản lý Bằng cấp**. Chức năng này là một phần thiết yếu của hệ thống "Quản lý thông tin giáo viên", cho phép người quản trị hệ thống (Administrator) thực hiện các thao tác quản lý danh mục các loại bằng cấp (ví dụ: Cử nhân, Thạc sĩ, Tiến sĩ, v.v.).

### 2.1. Các tính năng chính (Use Cases)

Người quản lý (Administrator) có thể thực hiện các hành động sau:

* **UC1: Thêm Bằng cấp:** Cho phép thêm một bằng cấp mới vào hệ thống.
    * *Thông tin nhập:* Tên đầy đủ (bắt buộc), Tên viết tắt.
* **UC2: Xem Danh sách Bằng cấp:** Hiển thị danh sách các bằng cấp hiện có với các thông tin: Mã, Tên đầy đủ, Tên viết tắt và các hành động (Xem chi tiết, Sửa, Xóa).
* **UC3: Sửa Bằng cấp:** Cho phép chỉnh sửa thông tin của một bằng cấp đã tồn tại (Tên đầy đủ, Tên viết tắt). Mã bằng cấp không được sửa.
* **UC4: Xóa Bằng cấp:** Cho phép xóa một bằng cấp khỏi hệ thống (sau khi xác nhận).
* **UC5: Tìm kiếm Bằng cấp:** Cho phép tìm kiếm nhanh các bằng cấp theo tên đầy đủ hoặc tên viết tắt.
* **UC6: Xem Chi tiết Bằng cấp:** Cho phép xem thông tin chi tiết (Mã, Tên đầy đủ, Tên viết tắt) của một bằng cấp ở chế độ chỉ đọc.

### 2.2. Tác nhân (Actor)

* Người quản lý (Administrator)

## 3. Nội dung Báo cáo

Tài liệu này bao gồm các phần chính sau:

* **Phần I: Bản đặc tả phần mềm**
    * Mô tả bài toán (chung và cho Nhóm chức năng 1)
    * Sơ đồ Use Case
    * Đặc tả chi tiết các Use Case
* **Phần II: Báo cáo cài đặt nhóm chức năng 1** (Do Nguyễn Đức Anh và Trịnh Hoài Nam thực hiện)
    * Môi trường cài đặt
    * Kiến trúc chung (hiện tại dựa trên HTML/CSS/JS và đề xuất cho ứng dụng hoàn chỉnh)
    * Cấu trúc mã nguồn (HTML, CSS, JavaScript cho chức năng Quản lý Bằng cấp)
    * Sơ đồ lớp (mô phỏng)
* **Phần III: Kế hoạch kiểm thử và Xây dựng các trường hợp kiểm thử** (Do Phạm Hoàng Anh (L) và Hoàng Thị Thảo Nhi thực hiện)
    * Kế hoạch kiểm thử (Test Plan) chi tiết
    * Danh sách các Trường hợp kiểm thử (Test Cases) cụ thể

## 4. Công nghệ sử dụng (cho phần giao diện mô phỏng)

* **Client-side:**
    * HTML5
    * CSS3 (bao gồm việc sử dụng các lớp tiện ích của Tailwind CSS)
    * JavaScript (ES6)
* **Dữ liệu:** Quản lý tạm thời trong JavaScript (`sampleData`) cho mục đích mô phỏng.

### Công nghệ đề xuất cho ứng dụng hoàn chỉnh:

* **Web Server:** Nginx, Apache
* **Backend Runtime:** Node.js (với Express.js), Java (với Spring Boot), Python (với Django/Flask), PHP (với Laravel)
* **Hệ quản trị Cơ sở dữ liệu:** PostgreSQL, MySQL, MongoDB

## 5. Cách xem và kiểm thử (Mô phỏng)

1.  Mở tệp `*.html` bằng trình duyệt web hiện đại (Google Chrome, Firefox, Edge, Safari).
2.  Sử dụng thanh điều hướng bên trái để chọn mục "Bằng cấp".
3.  Thực hiện các thao tác Thêm, Sửa, Xóa, Xem, Tìm kiếm theo các nút và trường trên giao diện.
    * Dữ liệu được lưu trữ tạm thời trong bộ nhớ trình duyệt và sẽ mất khi tải lại trang.

---
