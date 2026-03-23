# Midterm React + Express + MongoDB

Web app full-stack cho bai giua ki voi:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB local, xem du lieu bang MongoDB Compass
- API: REST CRUD cho `products`

## Tinh nang chinh

- Hien thi danh sach san pham
- Xem chi tiet san pham
- Them san pham moi
- Cap nhat san pham
- Xoa san pham
- Tim kiem theo ten
- Loc theo danh muc
- Loading state, error handling, feedback khi thao tac
- Seed san dung 4 san pham mau tu de

## Cau truc thu muc

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

## Yeu cau moi truong

- Node.js 24+
- MongoDB Server dang chay o `localhost:27017`
- MongoDB Compass de xem du lieu

## Cach chay bai

1. Cai package o thu muc goc:

```bash
npm install
```

2. Cai package cho backend:

```bash
cd backend
npm install
```

3. Tao file moi truong cho backend:

```bash
copy .env.example .env
```

Noi dung mac dinh:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/midterm_products
```

4. Cai package cho frontend:

```bash
cd ..\\frontend
npm install
```

5. Quay lai thu muc goc va chay ca app:

```bash
cd ..
npm run dev
```

## Port su dung

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## MongoDB Compass

- Connection string:

```text
mongodb://127.0.0.1:27017
```

- Database sau khi chay backend: `midterm_products`
- Collection chinh: `products`

Khi backend chay lan dau, he thong se tu seed 4 san pham mau neu collection dang trong.

## API chinh

- `GET /health`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Bonus:

- `GET /products?category=Phone`
- `GET /products?search=iphone`
- Co the ket hop ca `category` va `search`

## Demo nhanh

- Mo MongoDB Compass va connect toi `localhost:27017`
- Chay `npm run dev`
- Vao `http://localhost:5173`
- Thu them, sua, xoa san pham
- Mo Compass de xem du lieu thay doi truc tiep trong collection `products`

## GitHub

Repo public:

```text
https://github.com/Kise75/midterm-react-express-mongodb
```
