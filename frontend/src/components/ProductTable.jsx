import { Link } from 'react-router-dom'
import { formatCurrency, getProductImage } from '../utils/products'

function ProductTable({ products, deletingId, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="empty-box">
        <p>Không có sản phẩm phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link className="product-link" to={`/products/${product.id}`}>
                  <img
                    className="product-thumbnail"
                    src={getProductImage(product)}
                    alt={product.name}
                  />
                  <div className="product-link__content">
                    <strong>{product.name}</strong>
                    <span>Mã sản phẩm: {product.id}</span>
                    <span className="product-link__hint">Bấm để xem chi tiết</span>
                  </div>
                </Link>
              </td>
              <td>{product.category}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <div className="action-group">
                  <Link className="button button--small button--secondary" to={`/products/${product.id}`}>
                    Chi tiết
                  </Link>
                  <Link className="button button--small" to={`/products/${product.id}/edit`}>
                    Sửa
                  </Link>
                  <button
                    type="button"
                    className="button button--small button--danger"
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
