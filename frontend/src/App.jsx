import { startTransition, useDeferredValue, useEffect, useRef, useState } from 'react'
import FeedbackBanner from './components/FeedbackBanner'
import ProductCard from './components/ProductCard'
import ProductDetail from './components/ProductDetail'
import ProductForm from './components/ProductForm'
import Toolbar from './components/Toolbar'
import {
  API_BASE_URL,
  createProduct,
  getApiErrorMessage,
  listProducts,
  removeProduct,
  updateProduct,
} from './api/products'
import './App.css'
import {
  EMPTY_PRODUCT_FORM,
  formatCompactNumber,
  formatCurrency,
  productToFormValues,
  validateProductForm,
} from './utils/products'

function App() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
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
  const formSectionRef = useRef(null)
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

  function showNotice(type, title, message) {
    window.clearTimeout(noticeTimerRef.current)
    setNotice({ type, title, message })
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null)
    }, 3500)
  }

  function scrollToForm() {
    window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
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
      setDetailOpen(false)
    }
  }, [products, selectedProductId])

  useEffect(() => {
    if (!detailOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDetailOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [detailOpen])

  function beginCreate() {
    setMode('create')
    setFormValues(EMPTY_PRODUCT_FORM)
    setFormError('')
    setDetailOpen(false)
    showNotice('info', 'Tao san pham', 'Form tao san pham da san sang ben duoi.')
    scrollToForm()
  }

  function beginEdit(product) {
    setMode('edit')
    setSelectedProductId(product.id)
    setFormValues(productToFormValues(product))
    setFormError('')
    setDetailOpen(false)
    showNotice('info', 'Chinh sua san pham', `Ban dang sua ${product.name}.`)
    scrollToForm()
  }

  function openDetail(productId) {
    setSelectedProductId(productId)
    setDetailOpen(true)
  }

  function closeDetail() {
    setDetailOpen(false)
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

  async function handleImageFileChange(event) {
    const input = event.target
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('File da chon khong phai la anh hop le.')
      return
    }

    const imageDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(new Error('Khong doc duoc file anh da chon.'))
      reader.readAsDataURL(file)
    }).catch((error) => {
      setFormError(error.message)
      return ''
    })

    if (!imageDataUrl) return

    setFormValues((current) => ({
      ...current,
      image: imageDataUrl,
    }))
    input.value = ''
    setFormError('')
    showNotice('success', 'Anh da duoc chon', 'Anh tu may tinh se duoc luu cung san pham.')
  }

  function handleClearImage() {
    setFormValues((current) => ({
      ...current,
      image: '',
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const validationError = validateProductForm(formValues)
    if (validationError) {
      setFormError(validationError)
      showNotice('error', 'Du lieu chua hop le', validationError)
      return
    }

    const payload = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      price: Number(formValues.price),
      image: String(formValues.image ?? '').trim(),
      stock: Number(formValues.stock),
    }

    setSavingId(mode === 'edit' && selectedProduct ? selectedProduct.id : 'new')

    try {
      if (mode === 'edit' && selectedProduct) {
        const updated = await updateProduct(selectedProduct.id, payload)
        setProducts((current) =>
          current
            .map((product) => (product.id === updated.id ? updated : product))
            .sort((left, right) => left.id - right.id),
        )
        setSelectedProductId(updated.id)
        showNotice('success', 'Cap nhat thanh cong', `${updated.name} da duoc cap nhat.`)
      } else {
        const created = await createProduct(payload)
        setProducts((current) =>
          [created, ...current].sort((left, right) => left.id - right.id),
        )
        setSelectedProductId(created.id)
        showNotice('success', 'Them thanh cong', `${created.name} da duoc tao moi.`)
      }

      resetForm()
    } catch (error) {
      const message = getApiErrorMessage(error)
      setFormError(message)
      showNotice('error', 'Khong the luu san pham', message)
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Xoa san pham "${product.name}"?`)
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

      setDetailOpen(false)
      showNotice('success', 'Da xoa san pham', `${product.name} da duoc xoa.`)
    } catch (error) {
      showNotice('error', 'Xoa that bai', getApiErrorMessage(error))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-shell">
        <div className="hero-shell__content">
          <h1>Quan ly san pham</h1>
          <p className="hero-shell__lead">
            Theo doi danh sach san pham, them sua xoa va dong bo truc tiep voi MongoDB local.
          </p>
          <div className="hero-shell__actions">
            <button type="button" className="button button--primary" onClick={beginCreate}>
              Tao san pham
            </button>
            <span className="api-pill">API: {API_BASE_URL}</span>
          </div>
        </div>

        <div className="hero-shell__stats">
          <div className="stat-card">
            <span>San pham</span>
            <strong>{formatCompactNumber(products.length)}</strong>
          </div>
          <div className="stat-card">
            <span>Tong ton kho</span>
            <strong>{formatCompactNumber(totalStock)}</strong>
          </div>
          <div className="stat-card">
            <span>Gia tri kho</span>
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
          label: option === 'All categories' ? 'Tat ca' : option,
        }))}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onResetFilters={() => {
          setSearch('')
          setCategory('all')
          showNotice('info', 'Da bo loc', 'Danh sach da tro ve trang thai mac dinh.')
        }}
        onCreateNew={beginCreate}
        totalCount={products.length}
        visibleCount={visibleCount}
        isRefreshing={refreshing}
      />

      {pageError ? (
        <section className="panel panel--error">
          <div>
            <h3>{pageError}</h3>
            <p>
              Kiem tra backend o cong 5000, sau do bam thu lai de fetch danh sach tu MongoDB.
            </p>
          </div>
          <button
            type="button"
            className="button button--primary"
            onClick={() => void loadProducts(true)}
          >
            Thu lai
          </button>
        </section>
      ) : null}

      <main className="workspace">
        <section className="panel panel--list">
          <div className="panel__header">
            <div>
              <h3>{visibleCount} ket qua phu hop</h3>
              <p className="detail-subtitle">
                Bam vao san pham de mo man hinh chi tiet, bam Sua de dua du lieu vao form.
              </p>
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
                  isActive={product.id === selectedProductId}
                  isBusy={savingId === product.id}
                  onOpenDetail={openDetail}
                  onEdit={beginEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Khong tim thay san pham phu hop</h3>
              <p>
                Thu doi tu khoa tim kiem, chon lai danh muc hoac bo loc de xem toan bo.
              </p>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
              >
                Xoa bo loc
              </button>
            </div>
          )}
        </section>

        <aside className="workspace__sidebar" ref={formSectionRef}>
          <ProductForm
            mode={mode}
            values={formValues}
            onChange={handleFieldChange}
            onFileSelect={handleImageFileChange}
            onClearImage={handleClearImage}
            onSubmit={handleSubmit}
            onReset={resetForm}
            isSaving={savingId === 'new' || (selectedProduct && savingId === selectedProduct.id)}
            error={formError}
            categoryOptions={categoryOptions.filter((option) => option !== 'All categories')}
          />
        </aside>
      </main>

      {detailOpen ? (
        <div className="detail-modal-backdrop" onClick={closeDetail}>
          <div className="detail-modal-shell" onClick={(event) => event.stopPropagation()}>
            <ProductDetail
              product={selectedProduct}
              onEdit={beginEdit}
              onDelete={handleDelete}
              onCreateNew={beginCreate}
              onClose={closeDetail}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
