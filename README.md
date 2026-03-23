# Bài Giữa Kỳ React + Express + MongoDB

Ứng dụng full-stack quản lý sản phẩm với:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB local, xem dữ liệu bằng MongoDB Compass
- Giao tiếp: REST API

## Tính năng chính

- Hiển thị danh sách sản phẩm
- Xem chi tiết sản phẩm ở trang riêng
- Thêm sản phẩm mới
- Cập nhật sản phẩm
- Xóa sản phẩm
- Tìm kiếm theo tên
- Lọc theo danh mục
- Ảnh sản phẩm không bắt buộc
- Có thể dán URL ảnh hoặc chọn ảnh từ máy
- Dữ liệu mẫu được seed tự động vào MongoDB

## Cấu trúc thư mục

```text
Midterm/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- seed/
|   |   `-- utils/
|-- frontend/
|   `-- src/
|-- package.json
`-- README.md
```

## Yêu cầu môi trường

- Node.js 24+
- MongoDB Server đang chạy ở `localhost:27017`
- MongoDB Compass để xem dữ liệu

## Cách chạy bài

1. Cài package ở thư mục gốc:

```bash
npm install
```

2. Cài package cho backend:

```bash
cd backend
npm install
```

3. Tạo file môi trường cho backend:

```bash
copy .env.example .env
```

Nội dung mặc định:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/midterm_products
```

4. Cài package cho frontend:

```bash
cd ..\\frontend
npm install
```

5. Quay lại thư mục gốc và chạy cả ứng dụng:

```bash
cd ..
npm run dev
```

## Cổng sử dụng

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## MongoDB Compass

- Connection string:

```text
mongodb://127.0.0.1:27017
```

- Database sau khi chạy backend: `midterm_products`
- Collection chính: `products`

Khi backend chạy lần đầu, hệ thống sẽ tự seed 4 sản phẩm mẫu nếu collection đang trống.

## API chính

- `GET /`
- `GET /health`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Bonus:

- `GET /products?category=Phone`
- `GET /products?search=iphone`
- Có thể kết hợp cả `category` và `search`

## Demo nhanh

- Mở MongoDB Compass và connect tới `localhost:27017`
- Chạy `npm run dev`
- Vào `http://localhost:5173`
- Thử thêm, sửa, xóa sản phẩm
- Mở Compass để xem dữ liệu thay đổi trực tiếp trong collection `products`

## GitHub

Repo public:

```text
https://github.com/Kise75/midterm-react-express-mongodb
```
