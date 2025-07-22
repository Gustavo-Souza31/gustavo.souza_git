import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  create: (supplier) => api.post('/suppliers', supplier),
  update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  delete: (id) => api.delete(`/suppliers/${id}`),
}

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
}

// Stock API
export const stockAPI = {
  getMovements: () => api.get('/stock-movements'),
  getProductMovements: (productId) => api.get(`/stock-movements/product/${productId}`),
  getMovementsByPeriod: (startDate, endDate) => api.get('/stock-movements/period', {
    params: { start_date: startDate, end_date: endDate }
  }),
  createMovement: (movement) => api.post('/stock-movements', movement),
  getStockReport: () => api.get('/stock-report'),
}

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
}

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id) => api.get(`/sales/${id}`),
  getSalesByPeriod: (startDate, endDate) => api.get('/sales/period', {
    params: { start_date: startDate, end_date: endDate }
  }),
  getSalesReport: (startDate, endDate) => api.get('/sales/report', {
    params: { start_date: startDate, end_date: endDate }
  }),
  create: (sale) => api.post('/sales', sale),
}

export default api

