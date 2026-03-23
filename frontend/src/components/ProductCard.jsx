import { formatCurrency, getProductImage } from '../utils/products'

function ProductCard({ product, isActive, isBusy, onOpenDetail, onEdit, onDelete }) {
  return (
    <article className={`product-card ${isActive ? 'is-active' : ''}`}>
      <button
        type="button"
        className="product-card__main"
        onClick={() => onOpenDetail(product.id)}
        disabled={isBusy}
      >
        <img
          className="product-card__image"
          src={getProductImage(product)}
          alt={product.name}
        />

        <div className="product-card__body">
          <div className="product-card__topline">
            <span className="badge">{product.category}</span>
            <span className="product-card__stock">{product.stock} in stock</span>
          </div>
          <h3>{product.name}</h3>
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          <p className="product-card__hint">Bam de mo chi tiet san pham.</p>
        </div>
      </button>

      <div className="product-card__actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onOpenDetail(product.id)}
          disabled={isBusy}
        >
          Chi tiet
        </button>
        <button
          type="button"
          className="button button--soft"
          onClick={() => onEdit(product)}
          disabled={isBusy}
        >
          Sua
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(product)}
          disabled={isBusy}
        >
          Xoa
        </button>
      </div>
    </article>
  )
}

export default ProductCard
