import { getProductImage } from '../utils/products'

function ProductForm({
  title,
  values,
  error,
  isSaving,
  categoryOptions,
  onChange,
  onFileSelect,
  onClearImage,
  onSubmit,
  onReset,
  onCancel,
}) {
  const usingLocalImage = String(values.image ?? '').startsWith('data:image/')

  return (
    <form className="content-card form-card" onSubmit={onSubmit}>
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          <p className="muted-text">
            Ảnh sản phẩm là tùy chọn. Có thể dán URL, chọn file từ máy, hoặc để trống.
          </p>
        </div>
        {onCancel ? (
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Quay lại
          </button>
        ) : null}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Tên sản phẩm</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Ví dụ: iPhone 14"
          />
        </label>

        <label className="field">
          <span>Danh mục</span>
          <input
            type="text"
            name="category"
            value={values.category}
            onChange={onChange}
            list="category-options"
            placeholder="Ví dụ: Phone"
          />
          <datalist id="category-options">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="field">
          <span>Giá</span>
          <input
            type="number"
            name="price"
            min="1"
            step="1"
            value={values.price}
            onChange={onChange}
            placeholder="1200"
          />
        </label>

        <label className="field">
          <span>Tồn kho</span>
          <input
            type="number"
            name="stock"
            min="0"
            step="1"
            value={values.stock}
            onChange={onChange}
            placeholder="10"
          />
        </label>

        <label className="field form-grid__full">
          <span>URL ảnh, không bắt buộc</span>
          <input
            type="text"
            name="image"
            value={usingLocalImage ? '' : values.image}
            onChange={onChange}
            placeholder="Dán URL ảnh nếu có"
          />
        </label>

        <label className="field form-grid__full">
          <span>Hoặc chọn ảnh từ máy</span>
          <input type="file" accept="image/*" onChange={onFileSelect} />
        </label>

        {usingLocalImage ? (
          <p className="muted-text form-grid__full">
            Đang dùng ảnh được chọn từ máy tính.
          </p>
        ) : null}
      </div>

      <div className="preview-box">
        <div>
          <h3>Xem trước ảnh</h3>
          <p className="muted-text">Nếu không có ảnh, hệ thống sẽ dùng ảnh mặc định.</p>
        </div>
        <div className="preview-box__media">
          <img className="preview-box__image" src={getProductImage(values)} alt="Xem trước" />
        </div>
        {values.image ? (
          <button
            type="button"
            className="button button--secondary preview-box__clear"
            onClick={onClearImage}
          >
            Xóa ảnh hiện tại
          </button>
        ) : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="action-group">
        <button type="submit" className="button" disabled={isSaving}>
          {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
        <button type="button" className="button button--secondary" onClick={onReset}>
          Làm trống form
        </button>
      </div>
    </form>
  )
}

export default ProductForm
