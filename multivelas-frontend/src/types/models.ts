export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface DetalleVenta {
  producto: string | Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: 'minorista' | 'mayorista';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
}

export interface Venta {
  _id: string;
  fechaVenta: string;
  cliente: Cliente;
  productos: Array<{
    producto: Producto;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  metodoPago: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  vendedor: Empleado;
}

export interface Empleado {
  _id: string;
  nombreCompleto: string;
  dpi: string;
  nit: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  estadoCivil: string;
  nacionalidad: string;
  direccion: {
    calle: string;
    zona: string;
    colonia: string;
    municipio: string;
    departamento: string;
  };
  email: string;
  telefono: string;
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  numeroEmpleado: string;
  fechaContratacion: string;
  puesto: string;
  departamento: string;
  rol: 'admin' | 'vendedor' | 'financiero';
  sueldoBase: number;
  tipoContrato: string;
  horarioTrabajo: {
    dias: string[];
    horaInicio: string;
    horaFin: string;
  };
  supervisor: string;
  numeroIGSS: string;
  numeroIRTRA: string;
  foto: string;
  documentos: Array<{
    nombre: string;
    tipo: string;
    url: string;
  }>;
  notas: string;
  fechaFinContrato: string;
  estado: 'activo' | 'inactivo';
  password: string;
  datosBancarios: {
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string;
  };
}

export interface Transaccion {
  tipo: 'ingreso' | 'egreso';
  categoria: 'ventas' | 'salarios' | 'inventario' | 'servicios' | 'impuestos' | 'otros';
  descripcion: string;
  monto: number;
  fecha: Date;
  referencia?: string;
  tipoReferencia?: 'Venta' | 'Empleado' | 'Producto';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque';
}

export interface Balance {
  fecha: Date;
  activos: {
    efectivo: number;
    inventario: number;
    cuentasPorCobrar: number;
    otrosActivos: number;
  };
  pasivos: {
    cuentasPorPagar: number;
    impuestosPorPagar: number;
    salariosPorPagar: number;
    otrosPasivos: number;
  };
  capital: {
    capitalSocial: number;
    utilidadesRetenidas: number;
  };
}

export interface Financiero {
  _id: string;
  fechaTransaccion: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  categoria: string;
  metodoPago: string;
  estado: 'pendiente' | 'completado' | 'cancelado';
  notas: string;
}

export interface Usuario {
  _id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'vendedor' | 'financiero';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  loading: boolean;
  dialog: {
    open: boolean;
    type: string | null;
    data: any | null;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
} 