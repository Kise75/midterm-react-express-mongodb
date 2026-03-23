export const EMPTY_PRODUCT_FORM = {
  name: '',
  category: '',
  price: '',
  image: '',
  stock: '',
}

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <rect width="960" height="720" fill="#e7ecef"/>
    <rect x="180" y="150" width="600" height="420" rx="32" fill="#f8fafc" stroke="#94a3b8" stroke-width="8"/>
    <circle cx="330" cy="290" r="52" fill="#cbd5e1"/>
    <path d="M250 500l150-150 110 110 80-80 120 120H250z" fill="#94a3b8"/>
    <text x="480" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" fill="#475569">
      No image
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

  if (!name) return 'Ten san pham khong duoc de trong.'
  if (!category) return 'Danh muc khong duoc de trong.'
  if (!Number.isFinite(price) || price <= 0) return 'Gia phai lon hon 0.'
  if (!Number.isFinite(stock) || stock < 0) return 'Ton kho phai tu 0 tro len.'

  return null
}

export function getProductImage(product = {}) {
  const image = String(product.image ?? '').trim()
  return image || DEFAULT_PRODUCT_IMAGE
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0)
}
