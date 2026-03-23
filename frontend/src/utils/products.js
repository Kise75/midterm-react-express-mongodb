export const EMPTY_PRODUCT_FORM = {
  name: '',
  category: '',
  price: '',
  image: '',
  stock: '',
}

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
    image: product.image ?? '',
    stock: product.stock ?? '',
  }
}

export function validateProductForm(values) {
  const name = String(values.name ?? '').trim()
  const category = String(values.category ?? '').trim()
  const image = String(values.image ?? '').trim()
  const price = Number(values.price)
  const stock = Number(values.stock)

  if (!name) return 'Tên sản phẩm không được để trống.'
  if (!category) return 'Danh mục không được để trống.'
  if (!image) return 'Ảnh sản phẩm không được để trống.'
  if (!Number.isFinite(price) || price <= 0) return 'Giá phải lớn hơn 0.'
  if (!Number.isFinite(stock) || stock < 0) return 'Tồn kho phải từ 0 trở lên.'

  return null
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

