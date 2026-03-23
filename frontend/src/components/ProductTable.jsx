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
                <div className="product-preview">
                  <Link className="product-link" to={`/products/${product.id}`}>
                    <img
                      className="product-thumbnail"
                      src={getProductImage(product)}
                      alt={product.name}
                    />
                    <div className="product-link__content">
                      <strong>{product.name}</strong>
                      <span>Mã sản phẩm: {product.id}</span>
                      <span className="product-link__hint">
                        Di chuột để xem nhanh, bấm để mở chi tiết
                      </span>
                    </div>
                  </Link>

                  <div className="product-quick-view">
                    <div className="product-quick-view__media">
                      <img src={getProductImage(product)} alt={`Xem nhanh ${product.name}`} />
                    </div>

                    <div className="product-quick-view__content">
                      <span className="product-quick-view__badge">Xem nhanh</span>
                      <strong>{product.name}</strong>
                      <p>Danh mục: {product.category}</p>
                      <div className="product-quick-view__meta">
                        <span>{formatCurrency(product.price)}</span>
                        <span>Tồn kho: {product.stock}</span>
                      </div>
                      <span className="product-quick-view__note">
                        Bấm vào sản phẩm để mở trang chi tiết.
                      </span>
                    </div>
                  </div>
                </div>
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
