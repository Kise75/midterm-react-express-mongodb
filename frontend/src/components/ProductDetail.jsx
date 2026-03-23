import { formatCurrency } from '../utils/products'

function ProductDetail({ product, onEdit, onDelete, onCreateNew }) {
  if (!product) {
    return (
      <section className="panel panel--detail">
        <div className="empty-state empty-state--detail">
          <p className="eyebrow">Chi tiết sản phẩm</p>
          <h3>Chọn một sản phẩm để xem thông tin</h3>
          <p>
            Thông tin chi tiết, ảnh, giá và tồn kho sẽ xuất hiện ở đây sau khi bạn click
            vào một card bên trái.
          </p>
          <button type="button" className="button button--primary" onClick={onCreateNew}>
            Tạo sản phẩm mới
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="panel panel--detail">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Chi tiết sản phẩm</p>
          <h3>{product.name}</h3>
        </div>
        <span className="badge badge--accent">#{product.id}</span>
      </div>

      <img className="detail-hero" src={product.image} alt={product.name} />

      <div className="detail-grid">
        <div className="detail-item">
          <span>Danh mục</span>
          <strong>{product.category}</strong>
        </div>
        <div className="detail-item">
          <span>Giá</span>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <div className="detail-item">
          <span>Tồn kho</span>
          <strong>{product.stock}</strong>
        </div>
        <div className="detail-item">
          <span>Giá trị kho</span>
          <strong>{formatCurrency(product.price * product.stock)}</strong>
        </div>
      </div>

      <div className="panel__actions">
        <button type="button" className="button button--primary" onClick={() => onEdit(product)}>
          Chỉnh sửa
        </button>
        <button type="button" className="button button--danger" onClick={() => onDelete(product)}>
          Xóa sản phẩm
        </button>
      </div>
    </section>
  )
}

export default ProductDetail

