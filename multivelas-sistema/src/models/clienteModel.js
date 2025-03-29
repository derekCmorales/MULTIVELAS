const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    calle: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
    pais: String
  },
  tipoCliente: {
    type: String,
    enum: ['minorista', 'mayorista', 'distribuidor'],
    default: 'minorista'
  },
  nivelDistribuidor: {
    type: String,
    enum: ['bronce', 'plata', 'oro', 'platino', null],
    default: null
  },
  puntos: {
    type: Number,
    default: 0,
    min: 0
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimaCompra: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  notas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
clienteSchema.index({ email: 1 });
clienteSchema.index({ nombre: 1 });
clienteSchema.index({ tipoCliente: 1 });
clienteSchema.index({ nivelDistribuidor: 1 });
clienteSchema.index({ estado: 1 });

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente; 