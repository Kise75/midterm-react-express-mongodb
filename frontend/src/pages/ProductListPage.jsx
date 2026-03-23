import { Link } from 'react-router-dom'
import ProductTable from '../components/ProductTable'
import { formatCompactNumber, formatCurrency } from '../utils/products'

function ProductListPage({ products, loading, error, deletingId, onReload, onDelete }) {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  return (
    <div className="page-stack">
      <section className="content-card">
        <div className="page-head">
          <div>
            <h2>Danh sách sản phẩm</h2>
            <p className="muted-text">
              Trang này hiển thị toàn bộ sản phẩm hiện có trong hệ thống.
            </p>
          </div>
          <Link className="button" to="/products/new">
            Thêm sản phẩm
          </Link>
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
            products={products}
            deletingId={deletingId}
            onDelete={onDelete}
          />
        )}
      </section>
    </div>
  )
}

export default ProductListPage
