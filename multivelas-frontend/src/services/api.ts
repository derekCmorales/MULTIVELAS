import axios from 'axios';
import { Producto, Venta, Empleado, Financiero } from '../types/models';
import { ApiResponse } from '../types/api';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Servicio de Autenticación
export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; empleado: Empleado }>>('/empleados/login', { email, password }),
  obtenerPerfil: () =>
    api.get<ApiResponse<Empleado>>('/empleados/perfil/me'),
};

// Servicios de Productos
export const productoService = {
  obtenerTodos: () => api.get<ApiResponse<Producto[]>>('/productos'),
  obtenerPorId: (id: string) => api.get<ApiResponse<Producto>>(`/productos/${id}`),
  crear: (producto: Omit<Producto, '_id'>) => api.post<ApiResponse<Producto>>('/productos', producto),
  actualizar: (id: string, producto: Partial<Producto>) =>
    api.put<ApiResponse<Producto>>(`/productos/${id}`, producto),
  eliminar: (id: string) => api.delete<ApiResponse<void>>(`/productos/${id}`),
  actualizarStock: (id: string, cantidad: number) =>
    api.put<ApiResponse<Producto>>(`/productos/${id}/stock`, { cantidad }),
  obtenerPorCategoria: (categoria: string) =>
    api.get<ApiResponse<Producto[]>>(`/productos/categoria/${categoria}`),
};

// Servicios de Ventas
export const ventaService = {
  obtenerTodas: () => api.get<ApiResponse<Venta[]>>('/ventas'),
  obtenerPorId: (id: string) => api.get<ApiResponse<Venta>>(`/ventas/${id}`),
  crear: (venta: Omit<Venta, '_id'>) => api.post<ApiResponse<Venta>>('/ventas', venta),
  cancelar: (id: string) => api.put<ApiResponse<Venta>>(`/ventas/${id}/cancelar`),
  obtenerPorPeriodo: (fechaInicio: string, fechaFin: string) =>
    api.get<ApiResponse<Venta[]>>('/ventas/fecha/periodo', { params: { fechaInicio, fechaFin } }),
};

// Servicios de Empleados
export const empleadoService = {
  obtenerTodos: () => api.get<ApiResponse<Empleado[]>>('/empleados'),
  obtenerPorId: (id: string) => api.get<ApiResponse<Empleado>>(`/empleados/${id}`),
  crear: (empleado: FormData) =>
    api.post<ApiResponse<Empleado>>('/empleados/registro', empleado, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  actualizar: (id: string, empleado: FormData) =>
    api.put<ApiResponse<Empleado>>(`/empleados/${id}`, empleado, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  eliminar: (id: string) => api.delete<ApiResponse<void>>(`/empleados/${id}`),
  obtenerPorRol: (rol: string) => api.get<ApiResponse<Empleado[]>>(`/empleados/rol/${rol}`),
  actualizarDatosBancarios: (id: string, datosBancarios: Empleado['datosBancarios']) =>
    api.put<ApiResponse<Empleado>>(`/empleados/${id}/datos-bancarios`, datosBancarios),
  obtenerNomina: () => api.get<ApiResponse<any>>('/empleados/nomina'),
};

// Servicios Financieros
export const financieroService = {
  obtenerBalanceGeneral: () => api.get<ApiResponse<any>>('/financiero/balance'),
  registrarTransaccion: (transaccion: Omit<Financiero['transacciones'][0], 'fecha'>) =>
    api.post<ApiResponse<Financiero>>('/financiero/transaccion', transaccion),
  obtenerTransaccionesPorPeriodo: (fechaInicio: string, fechaFin: string) =>
    api.get<ApiResponse<Financiero[]>>('/financiero/transacciones/periodo', { params: { fechaInicio, fechaFin } }),
  obtenerResumen: () => api.get<ApiResponse<any>>('/financiero/resumen'),
  obtenerBalancesPorPeriodo: (fechaInicio: string, fechaFin: string) =>
    api.get<ApiResponse<any[]>>('/financiero/balances/periodo', { params: { fechaInicio, fechaFin } }),
};

export default api; 