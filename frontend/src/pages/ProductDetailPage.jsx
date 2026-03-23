import { useNavigate, useParams } from 'react-router-dom'
import ProductDetail from '../components/ProductDetail'

function ProductDetailPage({ products, loading, deletingId, onDelete }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const productId = Number(id)
  const product = products.find((item) => item.id === productId) ?? null

  async function handleDelete(productToDelete) {
    const deleted = await onDelete(productToDelete)
    if (deleted) {
      navigate('/products')
    }
  }

  if (loading) {
    return (
      <div className="content-card">
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    )
  }

  return (
    <ProductDetail
      product={product}
      isDeleting={deletingId === productId}
      onDelete={handleDelete}
    />
  )
}

export default ProductDetailPage
