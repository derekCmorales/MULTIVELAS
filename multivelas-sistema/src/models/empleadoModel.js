const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const empleadoSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6,
    select: false
  },
  rol: {
    type: String,
    required: [true, 'El rol es requerido'],
    enum: ['admin', 'vendedor', 'inventario', 'financiero'],
    default: 'vendedor'
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
  fechaContratacion: {
    type: Date,
    required: true
  },
  salario: {
    type: Number,
    required: true,
    min: 0
  },
  datosBancarios: {
    banco: String,
    numeroCuenta: String,
    tipoCuenta: {
      type: String,
      enum: ['corriente', 'ahorros', 'nómina']
    }
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  ultimoAcceso: {
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
empleadoSchema.index({ email: 1 });
empleadoSchema.index({ rol: 1 });
empleadoSchema.index({ estado: 1 });

// Middleware para encriptar contraseña antes de guardar
empleadoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
empleadoSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado; 