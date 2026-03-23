export const EMPTY_PRODUCT_FORM = {
  name: '',
  category: '',
  price: '',
  image: '',
  stock: '',
}

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <rect width="960" height="720" fill="#eef2f7"/>
    <rect x="170" y="150" width="620" height="420" rx="28" fill="#ffffff" stroke="#b8c4d3" stroke-width="8"/>
    <circle cx="340" cy="290" r="50" fill="#d8e0ea"/>
    <path d="M250 500l130-130 110 105 90-95 130 120H250z" fill="#9aa9bb"/>
    <text x="480" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#5b6b7d">
      Chưa có ảnh
    </text>
  </svg>`,
)}`

export function normalizeProduct(product = {}) {
  return {
    id: Number(product.id ?? product._id ?? 0),
    name: String(product.name ?? '').trim(),
    category: String(product.category ?? '').trim(),
    price: Number(product.price ?? 0),
    image: String(product.image ?? '').trim(),
    stock: Number(product.stock ?? 0),
  }
}

export function productToFormValues(product = {}) {
  return {
    name: product.name ?? '',
    category: product.category ?? '',
    price: product.price ?? '',
    image: String(product.image ?? ''),
    stock: product.stock ?? '',
  }
}

export function validateProductForm(values) {
  const name = String(values.name ?? '').trim()
  const category = String(values.category ?? '').trim()
  const price = Number(values.price)
  const stock = Number(values.stock)

  if (!name) return 'Tên sản phẩm không được để trống.'
  if (!category) return 'Danh mục không được để trống.'
  if (!Number.isFinite(price) || price <= 0) return 'Giá phải lớn hơn 0.'
  if (!Number.isFinite(stock) || stock < 0) return 'Tồn kho phải từ 0 trở lên.'

  return null
}

export function getProductImage(product = {}) {
  const image = String(product.image ?? '').trim()
  return image || DEFAULT_PRODUCT_IMAGE
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0)
}
