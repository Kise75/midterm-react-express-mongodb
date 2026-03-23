import { formatCurrency } from '../utils/products'

function ProductCard({ product, isActive, isBusy, onSelect, onEdit, onDelete }) {
  return (
    <article className={`product-card ${isActive ? 'is-active' : ''}`}>
      <button
        type="button"
        className="product-card__main"
        onClick={() => onSelect(product.id)}
        disabled={isBusy}
      >
        <img className="product-card__image" src={product.image} alt={product.name} />

        <div className="product-card__body">
          <div className="product-card__topline">
            <span className="badge">{product.category}</span>
            <span className="product-card__stock">{product.stock} in stock</span>
          </div>
          <h3>{product.name}</h3>
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          <p className="product-card__hint">Nhấn để xem chi tiết.</p>
        </div>
      </button>

      <div className="product-card__actions">
        <button
          type="button"
          className="button button--soft"
          onClick={() => onEdit(product)}
          disabled={isBusy}
        >
          Sửa
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(product)}
          disabled={isBusy}
        >
          Xóa
        </button>
      </div>
    </article>
  )
}

export default ProductCard
