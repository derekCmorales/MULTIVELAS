const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const empleadoSchema = new mongoose.Schema({
  // Información Personal
  nombreCompleto: { type: String, required: true },
  dpi: { type: String, required: true, unique: true },
  nit: { type: String },
  fechaNacimiento: { type: Date },
  edad: { type: Number },
  genero: { type: String, enum: ['masculino', 'femenino', 'otro'] },
  estadoCivil: { type: String, enum: ['soltero', 'casado', 'divorciado', 'viudo'] },
  nacionalidad: { type: String },

  // Información de Contacto
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: {
    calle: String,
    zona: String,
    colonia: String,
    municipio: String,
    departamento: String
  },
  contactoEmergencia: {
    nombre: String,
    telefono: String,
    relacion: String
  },

  // Información Laboral
  numeroEmpleado: { type: String, unique: true },
  fechaContratacion: { type: Date },
  puesto: { type: String },
  departamento: { type: String },
  rol: { type: String, enum: ['admin', 'vendedor', 'financiero'], default: 'vendedor' },
  sueldoBase: { type: Number },
  tipoContrato: { type: String, enum: ['temporal', 'permanente', 'prueba'] },
  horarioTrabajo: {
    dias: [{ type: String, enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] }],
    horaInicio: String,
    horaFin: String
  },

  // Información Legal y Administrativa
  numeroIGSS: { type: String },
  numeroIRTRA: { type: String },
  documentos: [{
    nombre: String,
    tipo: String,
    url: String
  }],

  // Información Adicional
  foto: { type: String },
  notas: { type: String },
  fechaFinContrato: { type: Date },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },

  // Credenciales
  password: { type: String, required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' }
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