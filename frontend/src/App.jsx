import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import FeedbackBanner from './components/FeedbackBanner'
import {
  createProduct,
  getApiErrorMessage,
  listProducts,
  removeProduct,
  updateProduct,
} from './api/products'
import './App.css'
import DashboardPage from './pages/DashboardPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductFormPage from './pages/ProductFormPage'
import ProductListPage from './pages/ProductListPage'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [notice, setNotice] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const noticeTimerRef = useRef(null)
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase()
  const searchedProducts = products.filter((product) => {
    if (!normalizedSearch) return true

    return `${product.name} ${product.category}`
      .toLowerCase()
      .includes(normalizedSearch)
  })

  function showNotice(type, title, message) {
    window.clearTimeout(noticeTimerRef.current)
    setNotice({ type, title, message })
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null)
    }, 3500)
  }

  async function loadProducts(showSpinner = true) {
    if (showSpinner) {
      setLoading(true)
    }

    try {
      const items = await listProducts()
      setProducts(items)
      setPageError('')
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      if (showSpinner) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void loadProducts()

    return () => {
      window.clearTimeout(noticeTimerRef.current)
    }
  }, [])

  async function handleCreate(payload) {
    try {
      const created = await createProduct(payload)
      setProducts((current) =>
        [...current, created].sort((left, right) => left.id - right.id),
      )
      showNotice('success', 'Thành công', 'Đã thêm sản phẩm mới.')
      return created
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await updateProduct(id, payload)
      setProducts((current) =>
        current
          .map((product) => (product.id === updated.id ? updated : product))
          .sort((left, right) => left.id - right.id),
      )
      showNotice('success', 'Thành công', 'Đã cập nhật sản phẩm.')
      return updated
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${product.name}" không?`)
    if (!confirmed) {
      return false
    }

    try {
      setDeletingId(product.id)
      await removeProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      showNotice('success', 'Thành công', `Đã xóa sản phẩm "${product.name}".`)
      return true
    } catch (error) {
      showNotice('error', 'Có lỗi', getApiErrorMessage(error))
      return false
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="app-page">
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="site-header__brand">
            <h1 className="site-title">Quản lý sản phẩm</h1>
          </div>

          <label className="site-search" aria-label="Tìm kiếm sản phẩm">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên hoặc danh mục"
            />
          </label>

          <nav className="site-nav">
            <NavLink
              end
              to="/"
              className={({ isActive }) =>
                `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
              }
            >
              Danh sách sản phẩm
            </NavLink>
            <NavLink
              to="/products/new"
              className={({ isActive }) =>
                `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
              }
            >
              Thêm sản phẩm
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container page-content">
        <FeedbackBanner notice={notice} />

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                products={products}
                visibleProducts={searchedProducts}
                searchTerm={searchTerm}
                loading={loading}
                error={pageError}
                deletingId={deletingId}
                onReload={() => loadProducts()}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductListPage
                products={products}
                visibleProducts={searchedProducts}
                searchTerm={searchTerm}
                loading={loading}
                error={pageError}
                deletingId={deletingId}
                onReload={() => loadProducts()}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/products/new"
            element={
              <ProductFormPage
                products={products}
                loading={loading}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailPage
                products={products}
                loading={loading}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProductFormPage
                products={products}
                loading={loading}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
