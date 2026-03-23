import axios from 'axios'
import { normalizeProduct } from '../utils/products'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

function normalizeProductList(data) {
  const list = Array.isArray(data) ? data : data?.data ?? data?.products ?? []
  return list.map(normalizeProduct).sort((left, right) => left.id - right.id)
}

function normalizeResponseProduct(data) {
  return normalizeProduct(data?.data ?? data?.product ?? data)
}

export function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.response?.status === 0) {
    return 'Không thể kết nối tới backend.'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Đã xảy ra lỗi không xác định.'
}

export async function listProducts() {
  const { data } = await api.get('/products')
  return normalizeProductList(data)
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return normalizeResponseProduct(data)
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload)
  return normalizeResponseProduct(data)
}

export async function removeProduct(id) {
  const { data } = await api.delete(`/products/${id}`)
  return data
}
