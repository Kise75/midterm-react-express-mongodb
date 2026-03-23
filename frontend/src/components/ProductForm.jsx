function ProductForm({
  mode,
  values,
  onChange,
  onSubmit,
  onReset,
  isSaving,
  error,
  categoryOptions,
}) {
  const isEditMode = mode === 'edit'

  return (
    <section className="panel panel--form">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{isEditMode ? 'Chỉnh sửa' : 'Thêm mới'}</p>
          <h3>{isEditMode ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}</h3>
        </div>
        {isEditMode ? <span className="badge badge--accent">Edit mode</span> : null}
      </div>

      <form className="product-form" onSubmit={onSubmit}>
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
            list="category-suggestions"
            placeholder="Ví dụ: Phone"
          />
          <datalist id="category-suggestions">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <div className="field-row">
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
        </div>

        <label className="field">
          <span>Image URL</span>
          <input
            type="url"
            name="image"
            value={values.image}
            onChange={onChange}
            placeholder="https://images.unsplash.com/..."
          />
        </label>

        {values.image ? (
          <img className="form-preview" src={values.image} alt={values.name || 'Preview'} />
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="panel__actions">
          <button type="submit" className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </button>
          <button type="button" className="button button--ghost" onClick={onReset}>
            {isEditMode ? 'Hủy chỉnh sửa' : 'Xóa form'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ProductForm

