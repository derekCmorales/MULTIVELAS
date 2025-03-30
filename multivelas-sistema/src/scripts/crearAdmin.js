const mongoose = require('mongoose');
const Empleado = require('../models/empleadoModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Eliminar admin existente si existe
    const adminExistente = await Empleado.findOne({ email: 'admin@multivelas.com' });
    if (adminExistente) {
      console.log('Eliminando administrador existente...');
      await Empleado.deleteOne({ email: 'admin@multivelas.com' });
      console.log('Administrador existente eliminado');
    }

    // Crear empleado administrador
    const admin = new Empleado({
      nombre: 'Administrador',
      email: 'admin@multivelas.com',
      password: 'admin123',
      dpi: '123456789',
      rol: 'admin',
      estado: 'activo'
    });

    await admin.save();
    console.log('Administrador creado exitosamente');
    console.log('Email: admin@multivelas.com');
    console.log('Password: admin123');

    // Verificar que se guardó correctamente
    const adminVerificado = await Empleado.findOne({ email: 'admin@multivelas.com' });
    console.log('Admin verificado:', adminVerificado ? 'Sí' : 'No');
    if (adminVerificado) {
      const esPasswordValido = await adminVerificado.compararPassword('admin123');
      console.log('¿Contraseña válida?:', esPasswordValido);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

crearAdmin(); 