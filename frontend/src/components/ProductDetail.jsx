import { Link } from 'react-router-dom'
import { formatCurrency, getProductImage } from '../utils/products'

function ProductDetail({ product, isDeleting, onDelete }) {
  if (!product) {
    return (
      <div className="content-card">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    )
  }

  return (
    <div className="content-card detail-card">
      <div className="detail-card__top">
        <div>
          <h2>{product.name}</h2>
          <p className="muted-text">Mã sản phẩm: {product.id}</p>
        </div>
        <div className="action-group">
          <Link className="button button--secondary" to="/products">
            Quay lại
          </Link>
          <Link className="button" to={`/products/${product.id}/edit`}>
            Sửa sản phẩm
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={() => onDelete(product)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
          </button>
        </div>
      </div>

      <div className="detail-card__body">
        <div className="detail-card__image">
          <img src={getProductImage(product)} alt={product.name} />
        </div>

        <div className="detail-card__info">
          <div className="info-item">
            <span>Danh mục</span>
            <strong>{product.category}</strong>
          </div>
          <div className="info-item">
            <span>Giá</span>
            <strong>{formatCurrency(product.price)}</strong>
          </div>
          <div className="info-item">
            <span>Tồn kho</span>
            <strong>{product.stock}</strong>
          </div>
          <div className="info-item">
            <span>Giá trị tồn kho</span>
            <strong>{formatCurrency(product.price * product.stock)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
