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
            <th className="product-table__head product-table__head--product">Sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th className="product-table__head product-table__head--actions">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="product-table__product">
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
              <td className="product-table__meta">{product.category}</td>
              <td className="product-table__meta">{formatCurrency(product.price)}</td>
              <td className="product-table__meta">{product.stock}</td>
              <td className="product-table__actions">
                <div className="action-group action-group--table">
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
