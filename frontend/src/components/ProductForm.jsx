import { getProductImage } from '../utils/products'

function ProductForm({
  mode,
  values,
  onChange,
  onFileSelect,
  onClearImage,
  onSubmit,
  onReset,
  isSaving,
  error,
  categoryOptions,
}) {
  const isEditMode = mode === 'edit'
  const usingLocalImage = String(values.image ?? '').startsWith('data:image/')

  return (
    <section className="panel panel--form">
      <div className="panel__header">
        <div>
          <h3>{isEditMode ? 'Cap nhat san pham' : 'Tao san pham moi'}</h3>
          <p className="detail-subtitle">
            Anh la tuy chon. Ban co the nhap URL, chon file tu may, hoac de trong.
          </p>
        </div>
        {isEditMode ? <span className="badge badge--accent">Edit</span> : null}
      </div>

      <form className="product-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Ten san pham</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Vi du: iPhone 14"
          />
        </label>

        <label className="field">
          <span>Danh muc</span>
          <input
            type="text"
            name="category"
            value={values.category}
            onChange={onChange}
            list="category-suggestions"
            placeholder="Vi du: Phone"
          />
          <datalist id="category-suggestions">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <div className="field-row">
          <label className="field">
            <span>Gia</span>
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
            <span>Ton kho</span>
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
          <span>Image URL (tuy chon)</span>
          <input
            type="text"
            name="image"
            value={usingLocalImage ? '' : values.image}
            onChange={onChange}
            placeholder="Dan URL vao day neu co"
          />
        </label>

        {usingLocalImage ? (
          <p className="detail-subtitle">Dang su dung anh duoc chon tu may tinh.</p>
        ) : null}

        <label className="field">
          <span>Hoac chon anh tu may</span>
          <input type="file" accept="image/*" onChange={onFileSelect} />
        </label>

        {(values.image || isEditMode) ? (
          <div className="field field--preview">
            <span>Xem truoc anh</span>
            <img
              className="form-preview"
              src={getProductImage(values)}
              alt={values.name || 'Preview'}
            />
            {values.image ? (
              <div className="panel__actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={onClearImage}
                >
                  Xoa anh dang chon
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="panel__actions">
          <button type="submit" className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Dang luu...' : isEditMode ? 'Luu thay doi' : 'Them san pham'}
          </button>
          <button type="button" className="button button--ghost" onClick={onReset}>
            {isEditMode ? 'Huy chinh sua' : 'Xoa form'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ProductForm
