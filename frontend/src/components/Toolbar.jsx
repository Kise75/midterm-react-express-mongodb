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
        <p className="eyebrow">Midterm dashboard</p>
        <h2>Quản lý danh sách sản phẩm bằng MongoDB</h2>
        <p className="toolbar__description">
          Tìm kiếm nhanh, lọc theo danh mục, thêm sửa xóa sản phẩm và đồng bộ với backend.
        </p>
      </div>

      <div className="toolbar__controls">
        <label className="field field--search">
          <span>Tìm kiếm</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nhập tên hoặc danh mục..."
          />
        </label>

        <label className="field">
          <span>Danh mục</span>
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
            Reset bộ lọc
          </button>
          <button type="button" className="button button--primary" onClick={onCreateNew}>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="toolbar__meta">
        <div className="meta-card">
          <span>Tổng sản phẩm</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="meta-card">
          <span>Đang hiển thị</span>
          <strong>{visibleCount}</strong>
        </div>
        <div className="meta-card">
          <span>Trạng thái API</span>
          <strong>{isRefreshing ? 'Đang đồng bộ...' : 'Sẵn sàng'}</strong>
        </div>
      </div>
    </section>
  )
}

export default Toolbar

