const mongoose = require('mongoose');

const financieroSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['ingreso', 'egreso']
  },
  descripcion: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  categoria: {
    type: String,
    required: true,
    enum: ['ventas', 'salarios', 'inventario', 'servicios', 'otros']
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'otro']
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'completado'
  },
  referencia: {
    type: String
  },
  notas: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Financiero', financieroSchema); 