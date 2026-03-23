import { Link } from 'react-router-dom'
import { useState } from 'react'
import ProductTable from '../components/ProductTable'
import { formatCompactNumber, formatCurrency } from '../utils/products'

function DashboardPage({
  products,
  visibleProducts,
  searchTerm,
  loading,
  error,
  deletingId,
  onReload,
  onDelete,
}) {
  const [category, setCategory] = useState('all')

  const categoryOptions = [
    'all',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ]

  const filteredProducts = visibleProducts.filter(
    (product) => category === 'all' || product.category === category,
  )

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  return (
    <div className="page-stack">
      <section className="content-card">
        <div className="page-head">
          <div>
            <h2>Dashboard</h2>
            <p className="muted-text">
              Tổng quan nhanh về dữ liệu sản phẩm và khu vực quản lý chính.
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
            <h2>Sản phẩm nổi bật trong hệ thống</h2>
            <p className="muted-text">
              Ô tìm kiếm đã được chuyển lên thanh menu phía trên để dùng xuyên suốt.
            </p>
          </div>
        </div>

        <div className="filter-grid">
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

          <div className="active-search-box">
            <span>Từ khóa đang tìm</span>
            <strong>{searchTerm.trim() ? searchTerm : 'Chưa nhập từ khóa'}</strong>
          </div>
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
        ) : filteredProducts.length === 0 ? (
          <div className="empty-box">
            <p>Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</p>
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
