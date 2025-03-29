const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['velas', 'aromatizantes', 'accesorios', 'otros']
  },
  imagen: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  caracteristicas: [{
    nombre: String,
    valor: String
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
productoSchema.index({ nombre: 'text', descripcion: 'text' });
productoSchema.index({ categoria: 1 });
productoSchema.index({ estado: 1 });

// Middleware para actualizar ultimaActualizacion
productoSchema.pre('save', function (next) {
  this.ultimaActualizacion = new Date();
  next();
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto; 