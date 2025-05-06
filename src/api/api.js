
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Productos API
export const getProductos = () => api.get('/productos');
export const createProducto = (producto) => api.post('/productos', producto);
export const updateProducto = (id, producto) => api.put(`/productos/${id}`, producto);
export const deleteProducto = (id) => api.delete(`/productos/${id}`);

// Ventas API
export const getVentas = () => api.get('/ventas');
export const createVenta = (venta) => api.post('/ventas', venta);
export const updateVenta = (id, venta) => api.put(`/ventas/${id}`, venta);
export const deleteVenta = (id) => api.delete(`/ventas/${id}`);

export default api;
