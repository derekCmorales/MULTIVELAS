export interface Producto {
  _id: string;
  nombre: string;
  identificador: string;
  descripcion: string;
  stock: number;
  precioUnidad: number;
  categoria: string;
  fechaCreacion: Date;
  ultimaActualizacion: Date;
}

export interface DetalleVenta {
  producto: string | Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
}

export interface Venta {
  _id: string;
  numeroFactura: string;
  fecha: Date;
  cliente: Cliente;
  detalles: DetalleVenta[];
  subtotal: number;
  iva: number;
  total: number;
  vendedor: string | Empleado;
  estado: 'pendiente' | 'completada' | 'cancelada';
}

export interface Empleado {
  _id: string;
  nombreCompleto: string;
  dpi: string;
  email: string;
  telefono: string;
  direccion: {
    calle: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
  };
  rol: 'administrador' | 'vendedor' | 'inventario' | 'contador';
  sueldoBase: number;
  fechaIngreso: Date;
  estado: 'activo' | 'inactivo';
  datosBancarios?: {
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
  transacciones: Transaccion[];
  balances: Balance[];
  ultimoBalance: Date;
} 