function Toolbar({
  search,
  category,
  categoryOptions,
  onSearchChange,
  onCategoryChange,
  onResetFilters,
  onCreateNew,
  totalCount,
  visibleCount,
  isRefreshing,
}) {
  return (
    <section className="toolbar">
      <div className="toolbar__copy">
        <h2>Danh sach san pham</h2>
        <p className="toolbar__description">
          Tim kiem nhanh, loc theo danh muc, mo chi tiet tung san pham va quan ly CRUD.
        </p>
      </div>

      <div className="toolbar__controls">
        <label className="field field--search">
          <span>Tim kiem</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nhap ten san pham..."
          />
        </label>

        <label className="field">
          <span>Danh muc</span>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="toolbar__actions">
          <button type="button" className="button button--ghost" onClick={onResetFilters}>
            Bo loc
          </button>
          <button type="button" className="button button--primary" onClick={onCreateNew}>
            Tao san pham
          </button>
        </div>
      </div>

      <div className="toolbar__meta">
        <div className="meta-card">
          <span>Tong san pham</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="meta-card">
          <span>Dang hien thi</span>
          <strong>{visibleCount}</strong>
        </div>
        <div className="meta-card">
          <span>Trang thai API</span>
          <strong>{isRefreshing ? 'Dang dong bo...' : 'San sang'}</strong>
        </div>
      </div>
    </section>
  )
}

export default Toolbar
