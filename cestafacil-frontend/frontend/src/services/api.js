import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Injeta JWT em todas as requisições autenticadas
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Trata erros globalmente
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cf_token')
      localStorage.removeItem('cf_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  login:    data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
  me:       ()   => api.get('/auth/me'),
  update:   data => api.put('/auth/profile', data),
}

// ── Produtos ─────────────────────────────────────────────────
export const produtosAPI = {
  listar: params => api.get('/produtos', { params }),
  buscar: id     => api.get(`/produtos/${id}`),
  categorias: () => api.get('/categorias'),
}

// ── Pedidos ──────────────────────────────────────────────────
export const pedidosAPI = {
  criar:   data          => api.post('/pedidos', data),
  meus:    params        => api.get('/pedidos', { params }),
  buscar:  id            => api.get(`/pedidos/${id}`),
}

// ── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  dashboard: ()            => api.get('/admin/dashboard'),
  // produtos
  criarProduto:    data    => api.post('/admin/produtos', data),
  editarProduto:   (id, d) => api.put(`/admin/produtos/${id}`, d),
  deletarProduto:  id      => api.delete(`/admin/produtos/${id}`),
  // pedidos
  pedidos:         params  => api.get('/admin/pedidos', { params }),
  atualizarStatus: (id, s) => api.patch(`/admin/pedidos/${id}/status`, null, { params: { status: s } }),
}

export default api
