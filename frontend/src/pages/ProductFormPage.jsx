import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import {
  EMPTY_PRODUCT_FORM,
  productToFormValues,
  validateProductForm,
} from '../utils/products'

function ProductFormPage({ products, loading, onCreate, onUpdate }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const productId = Number(id)
  const editingProduct = products.find((item) => item.id === productId) ?? null
  const [values, setValues] = useState(EMPTY_PRODUCT_FORM)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isEditMode && editingProduct) {
      setValues(productToFormValues(editingProduct))
    } else if (!isEditMode) {
      setValues(EMPTY_PRODUCT_FORM)
    }
  }, [editingProduct, isEditMode])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleFileSelect(event) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File đã chọn không phải là ảnh hợp lệ.')
      return
    }

    const imageDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(new Error('Không thể đọc file ảnh đã chọn.'))
      reader.readAsDataURL(file)
    }).catch((readError) => {
      setError(readError.message)
      return ''
    })

    if (!imageDataUrl) return

    setValues((current) => ({
      ...current,
      image: imageDataUrl,
    }))
    input.value = ''
    setError('')
  }

  function handleClearImage() {
    setValues((current) => ({
      ...current,
      image: '',
    }))
  }

  function handleReset() {
    if (isEditMode && editingProduct) {
      setValues(productToFormValues(editingProduct))
    } else {
      setValues(EMPTY_PRODUCT_FORM)
    }
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validateProductForm(values)
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      image: String(values.image ?? '').trim(),
      stock: Number(values.stock),
    }

    try {
      setIsSaving(true)
      const savedProduct = isEditMode
        ? await onUpdate(productId, payload)
        : await onCreate(payload)

      navigate(`/products/${savedProduct.id}`)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading && isEditMode && !editingProduct) {
    return (
      <div className="content-card">
        <p>Đang tải dữ liệu sản phẩm...</p>
      </div>
    )
  }

  if (isEditMode && !editingProduct) {
    return (
      <div className="content-card">
        <p>Không tìm thấy sản phẩm để chỉnh sửa.</p>
      </div>
    )
  }

  return (
    <ProductForm
      title={isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      values={values}
      error={error}
      isSaving={isSaving}
      categoryOptions={[...new Set(products.map((product) => product.category).filter(Boolean))]}
      onChange={handleChange}
      onFileSelect={handleFileSelect}
      onClearImage={handleClearImage}
      onSubmit={handleSubmit}
      onReset={handleReset}
      onCancel={() => navigate(isEditMode ? `/products/${productId}` : '/')}
    />
  )
}

export default ProductFormPage
