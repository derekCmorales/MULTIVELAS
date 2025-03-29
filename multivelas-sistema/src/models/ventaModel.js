const mongoose = require('mongoose');

const detalleVentaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const ventaSchema = new mongoose.Schema({
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  productos: [detalleVentaSchema],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'otro']
  },
  estado: {
    type: String,
    required: true,
    enum: ['completada', 'cancelada', 'pendiente'],
    default: 'completada'
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  fechaCancelacion: {
    type: Date
  },
  notas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
ventaSchema.index({ fecha: 1 });
ventaSchema.index({ vendedor: 1 });
ventaSchema.index({ cliente: 1 });
ventaSchema.index({ estado: 1 });

// Middleware para calcular el subtotal de cada detalle
ventaSchema.pre('save', function (next) {
  this.productos.forEach(detalle => {
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
  });
  this.total = this.productos.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  next();
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta; 