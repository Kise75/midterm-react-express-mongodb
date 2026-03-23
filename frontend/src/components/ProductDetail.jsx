import { formatCurrency, getProductImage } from '../utils/products'

function ProductDetail({ product, onEdit, onDelete, onCreateNew, onClose }) {
  if (!product) {
    return (
      <section className="panel panel--detail">
        <div className="empty-state empty-state--detail">
          <h3>Chua co san pham nao duoc chon</h3>
          <p>
            Bam vao mot san pham trong danh sach de mo man hinh chi tiet ro rang hon.
          </p>
          <button type="button" className="button button--primary" onClick={onCreateNew}>
            Tao san pham moi
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="panel panel--detail">
      <div className="panel__header">
        <div>
          <h3>{product.name}</h3>
          <p className="detail-subtitle">Chi tiet san pham #{product.id}</p>
        </div>
        <button type="button" className="button button--ghost" onClick={onClose}>
          Dong
        </button>
      </div>

      <img className="detail-hero" src={getProductImage(product)} alt={product.name} />

      <div className="detail-grid">
        <div className="detail-item">
          <span>Danh muc</span>
          <strong>{product.category}</strong>
        </div>
        <div className="detail-item">
          <span>Gia</span>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <div className="detail-item">
          <span>Ton kho</span>
          <strong>{product.stock}</strong>
        </div>
        <div className="detail-item">
          <span>Gia tri kho</span>
          <strong>{formatCurrency(product.price * product.stock)}</strong>
        </div>
      </div>

      <div className="panel__actions">
        <button type="button" className="button button--primary" onClick={() => onEdit(product)}>
          Chinh sua
        </button>
        <button type="button" className="button button--danger" onClick={() => onDelete(product)}>
          Xoa san pham
        </button>
      </div>
    </section>
  )
}

export default ProductDetail
