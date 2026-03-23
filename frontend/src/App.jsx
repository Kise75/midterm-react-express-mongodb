import { startTransition, useDeferredValue, useEffect, useRef, useState } from 'react'
import FeedbackBanner from './components/FeedbackBanner'
import ProductCard from './components/ProductCard'
import ProductDetail from './components/ProductDetail'
import ProductForm from './components/ProductForm'
import Toolbar from './components/Toolbar'
import { API_BASE_URL, createProduct, getApiErrorMessage, listProducts, removeProduct, updateProduct } from './api/products'
import './App.css'
import { EMPTY_PRODUCT_FORM, formatCompactNumber, formatCurrency, productToFormValues, validateProductForm } from './utils/products'

function App() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [mode, setMode] = useState('create')
  const [formValues, setFormValues] = useState(EMPTY_PRODUCT_FORM)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pageError, setPageError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState(null)
  const noticeTimerRef = useRef(null)
  const deferredSearch = useDeferredValue(search)

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null

  const categoryOptions = [
    'All categories',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ]

  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesSearch =
      !deferredSearch.trim() ||
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(deferredSearch.trim().toLowerCase())

    return matchesCategory && matchesSearch
  })

  const visibleCount = visibleProducts.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  )
  const activeProduct =
    visibleProducts.find((product) => product.id === selectedProductId) ??
    visibleProducts[0] ??
    null
  const activeProductId = activeProduct?.id ?? null

  function showNotice(type, title, message) {
    window.clearTimeout(noticeTimerRef.current)
    setNotice({ type, title, message })
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null)
    }, 3500)
  }

  async function loadProducts(showLoading = false) {
    if (showLoading) {
      setLoading(true)
      setPageError('')
    } else {
      setRefreshing(true)
    }

    try {
      const items = await listProducts()

      startTransition(() => {
        setProducts(items)
        setSelectedProductId((currentId) => {
          if (currentId && items.some((product) => product.id === currentId)) {
            return currentId
          }

          return items[0]?.id ?? null
        })
      })
    } catch (error) {
      const message = getApiErrorMessage(error)
      setPageError(message)
      if (showLoading) {
        setProducts([])
        setSelectedProductId(null)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadProducts(true)

    return () => {
      window.clearTimeout(noticeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (selectedProductId && !products.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(products[0]?.id ?? null)
    }
  }, [products, selectedProductId])

  function beginCreate() {
    setMode('create')
    setFormValues(EMPTY_PRODUCT_FORM)
    setFormError('')
    showNotice('info', 'Sẵn sàng thêm mới', 'Điền thông tin để tạo sản phẩm mới.')
  }

  function beginEdit(product) {
    setMode('edit')
    setSelectedProductId(product.id)
    setFormValues(productToFormValues(product))
    setFormError('')
  }

  function resetForm() {
    setMode('create')
    setFormValues(EMPTY_PRODUCT_FORM)
    setFormError('')
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const validationError = validateProductForm(formValues)
    if (validationError) {
      setFormError(validationError)
      showNotice('error', 'Dữ liệu chưa hợp lệ', validationError)
      return
    }

    const payload = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      price: Number(formValues.price),
      image: formValues.image.trim(),
      stock: Number(formValues.stock),
    }

    setSavingId(mode === 'edit' && selectedProduct ? selectedProduct.id : 'new')

    try {
      if (mode === 'edit' && selectedProduct) {
        const updated = await updateProduct(selectedProduct.id, payload)
        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? updated : product)).sort((left, right) => left.id - right.id),
        )
        setSelectedProductId(updated.id)
        showNotice('success', 'Cập nhật thành công', `${updated.name} đã được lưu vào MongoDB.`)
      } else {
        const created = await createProduct(payload)
        setProducts((current) =>
          [created, ...current].sort((left, right) => left.id - right.id),
        )
        setSelectedProductId(created.id)
        showNotice('success', 'Thêm thành công', `${created.name} đã được tạo mới.`)
      }

      resetForm()
    } catch (error) {
      const message = getApiErrorMessage(error)
      setFormError(message)
      showNotice('error', 'Không thể lưu sản phẩm', message)
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Xóa sản phẩm "${product.name}"?`)
    if (!confirmed) return

    setSavingId(product.id)

    try {
      await removeProduct(product.id)
      const remaining = products.filter((item) => item.id !== product.id)
      setProducts(remaining)
      setSelectedProductId((currentId) => {
        if (currentId !== product.id) return currentId
        return remaining[0]?.id ?? null
      })

      if (mode === 'edit' && selectedProduct?.id === product.id) {
        resetForm()
      }

      showNotice('success', 'Đã xóa sản phẩm', `${product.name} đã được xóa khỏi hệ thống.`)
    } catch (error) {
      showNotice('error', 'Xóa thất bại', getApiErrorMessage(error))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-shell">
        <div className="hero-shell__content">
          <p className="eyebrow">React + Express + MongoDB</p>
          <h1>Midterm product manager</h1>
          <p className="hero-shell__lead">
            Giao diện một trang để quản lý danh sách sản phẩm, xem chi tiết, thêm sửa xóa
            và đồng bộ với backend MongoDB local.
          </p>
          <div className="hero-shell__actions">
            <button type="button" className="button button--primary" onClick={beginCreate}>
              Tạo sản phẩm
            </button>
            <span className="api-pill">API: {API_BASE_URL}</span>
          </div>
        </div>

        <div className="hero-shell__stats">
          <div className="stat-card">
            <span>Sản phẩm</span>
            <strong>{formatCompactNumber(products.length)}</strong>
          </div>
          <div className="stat-card">
            <span>Tổng tồn kho</span>
            <strong>{formatCompactNumber(totalStock)}</strong>
          </div>
          <div className="stat-card">
            <span>Giá trị kho</span>
            <strong>{formatCurrency(inventoryValue)}</strong>
          </div>
        </div>
      </header>

      <FeedbackBanner notice={notice} />

      <Toolbar
        search={search}
        category={category}
        categoryOptions={categoryOptions.map((option) => ({
          value: option === 'All categories' ? 'all' : option,
          label: option,
        }))}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onResetFilters={() => {
          setSearch('')
          setCategory('all')
          showNotice('info', 'Bộ lọc đã được xóa', 'Danh sách trở về trạng thái mặc định.')
        }}
        onCreateNew={beginCreate}
        totalCount={products.length}
        visibleCount={visibleCount}
        isRefreshing={refreshing}
      />

      {pageError ? (
        <section className="panel panel--error">
          <div>
            <p className="eyebrow">Không thể tải dữ liệu</p>
            <h3>{pageError}</h3>
            <p>
              Kiểm tra backend ở cổng `5000`, sau đó bấm thử lại để fetch danh sách sản phẩm
              từ MongoDB.
            </p>
          </div>
          <button type="button" className="button button--primary" onClick={() => void loadProducts(true)}>
            Thử lại
          </button>
        </section>
      ) : null}

      <main className="workspace">
        <section className="panel panel--list">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Danh sách sản phẩm</p>
              <h3>{visibleCount} kết quả phù hợp</h3>
            </div>
            {loading ? <span className="badge">Loading...</span> : null}
          </div>

          {loading ? (
            <div className="grid grid--loading" aria-busy="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="product-card product-card--skeleton" key={index}>
                  <div className="skeleton skeleton--image" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line short" />
                  <div className="skeleton skeleton--line tiny" />
                </div>
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isActive={product.id === activeProductId}
                  isBusy={savingId === product.id}
                  onSelect={setSelectedProductId}
                  onEdit={beginEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Không có kết quả</p>
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>
                Thử đổi từ khóa tìm kiếm, chọn lại danh mục hoặc xóa bộ lọc để xem toàn bộ
                danh sách.
              </p>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </section>

        <aside className="workspace__sidebar">
          <ProductForm
            mode={mode}
            values={formValues}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onReset={resetForm}
            isSaving={savingId === 'new' || (selectedProduct && savingId === selectedProduct.id)}
            error={formError}
            categoryOptions={categoryOptions.filter((option) => option !== 'All categories')}
          />

          <ProductDetail
            product={activeProduct}
            onEdit={beginEdit}
            onDelete={handleDelete}
            onCreateNew={beginCreate}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
