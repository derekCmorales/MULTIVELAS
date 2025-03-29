import axios from 'axios';
import { Producto, Venta, Empleado, Financiero } from '../types/models';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un estado de error
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
      return Promise.reject({ mensaje: 'No se pudo conectar con el servidor' });
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
      return Promise.reject({ mensaje: 'Error al procesar la petición' });
    }
  }
);

// Servicios de Productos
export const productoService = {
  obtenerTodos: () => api.get<Producto[]>('/productos'),
  obtenerPorId: (id: string) => api.get<Producto>(`/productos/${id}`),
  crear: (producto: Omit<Producto, '_id'>) => api.post<Producto>('/productos', producto),
  actualizar: (id: string, producto: Partial<Producto>) => 
    api.put<Producto>(`/productos/${id}`, producto),
  eliminar: (id: string) => api.delete(`/productos/${id}`),
  actualizarStock: (id: string, cantidad: number) => 
    api.put<Producto>(`/productos/${id}/stock`, { cantidad }),
  obtenerPorCategoria: (categoria: string) => 
    api.get<Producto[]>(`/productos/categoria/${categoria}`),
};

// Servicios de Ventas
export const ventaService = {
  obtenerTodas: () => api.get<Venta[]>('/ventas'),
  obtenerPorId: (id: string) => api.get<Venta>(`/ventas/${id}`),
  crear: (venta: Omit<Venta, '_id'>) => api.post<Venta>('/ventas', venta),
  cancelar: (id: string) => api.put(`/ventas/${id}/cancelar`),
  obtenerPorPeriodo: (fechaInicio: string, fechaFin: string) => 
    api.get<Venta[]>('/ventas/fecha/periodo', { params: { fechaInicio, fechaFin } }),
};

// Servicios de Empleados
export const empleadoService = {
  obtenerTodos: () => api.get<Empleado[]>('/empleados'),
  obtenerPorId: (id: string) => api.get<Empleado>(`/empleados/${id}`),
  crear: (empleado: Omit<Empleado, '_id'>) => 
    api.post<Empleado>('/empleados', empleado),
  actualizar: (id: string, empleado: Partial<Empleado>) => 
    api.put<Empleado>(`/empleados/${id}`, empleado),
  eliminar: (id: string) => api.delete(`/empleados/${id}`),
  obtenerPorRol: (rol: string) => api.get<Empleado[]>(`/empleados/rol/${rol}`),
  actualizarDatosBancarios: (id: string, datosBancarios: Empleado['datosBancarios']) => 
    api.put(`/empleados/${id}/datos-bancarios`, datosBancarios),
  obtenerNomina: () => api.get('/empleados/nomina'),
};

// Servicios Financieros
export const financieroService = {
  obtenerBalanceGeneral: () => api.get('/financiero/balance'),
  registrarTransaccion: (transaccion: Omit<Financiero['transacciones'][0], 'fecha'>) => 
    api.post('/financiero/transaccion', transaccion),
  obtenerTransaccionesPorPeriodo: (fechaInicio: string, fechaFin: string) => 
    api.get('/financiero/transacciones/periodo', { params: { fechaInicio, fechaFin } }),
  obtenerResumen: () => api.get('/financiero/resumen'),
  crearBalance: (balance: Omit<Balance, 'fecha'>) => 
    api.post('/financiero/balance', balance),
  obtenerBalancesPorPeriodo: (fechaInicio: string, fechaFin: string) => 
    api.get('/financiero/balances/periodo', { params: { fechaInicio, fechaFin } }),
};

export default api; 