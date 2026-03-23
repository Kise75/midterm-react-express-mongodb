import { Link } from 'react-router-dom'
import { useDeferredValue, useState } from 'react'
import ProductTable from '../components/ProductTable'
import { formatCompactNumber, formatCurrency } from '../utils/products'

function DashboardPage({ products, loading, error, deletingId, onReload, onDelete }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const deferredSearch = useDeferredValue(search)

  const categoryOptions = [
    'all',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesSearch =
      !deferredSearch.trim() ||
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(deferredSearch.trim().toLowerCase())

    return matchesCategory && matchesSearch
  })

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  return (
    <div className="page-stack">
      <section className="content-card">
        <div className="page-head">
          <div>
            <h2>Dashboard</h2>
            <p className="muted-text">
              Tổng quan nhanh về dữ liệu sản phẩm và khu vực tìm kiếm trực tiếp.
            </p>
          </div>
          <div className="action-group">
            <Link className="button button--secondary" to="/products">
              Xem danh sách
            </Link>
            <Link className="button" to="/products/new">
              Thêm sản phẩm
            </Link>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-item">
            <span>Tổng sản phẩm</span>
            <strong>{formatCompactNumber(products.length)}</strong>
          </div>
          <div className="summary-item">
            <span>Tổng tồn kho</span>
            <strong>{formatCompactNumber(totalStock)}</strong>
          </div>
          <div className="summary-item">
            <span>Giá trị tồn kho</span>
            <strong>{formatCurrency(totalValue)}</strong>
          </div>
        </div>
      </section>

      <section className="content-card">
        <div className="page-head">
          <div>
            <h2>Tìm kiếm sản phẩm</h2>
            <p className="muted-text">
              Tìm nhanh theo tên và danh mục ngay trên Dashboard.
            </p>
          </div>
        </div>

        <div className="filter-grid">
          <label className="field">
            <span>Tìm kiếm</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </label>

          <label className="field">
            <span>Danh mục</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Tất cả' : option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <div className="empty-box">
            <p>{error}</p>
            <button type="button" className="button" onClick={onReload}>
              Tải lại dữ liệu
            </button>
          </div>
        ) : loading ? (
          <div className="empty-box">
            <p>Đang tải dữ liệu sản phẩm...</p>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            deletingId={deletingId}
            onDelete={onDelete}
          />
        )}
      </section>
    </div>
  )
}

export default DashboardPage
