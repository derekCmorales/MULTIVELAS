const mongoose = require('mongoose');
const Empleado = require('../models/empleadoModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExistente = await Empleado.findOne({ email: 'admin@admin.com' });
    if (adminExistente) {
      console.log('El administrador ya existe');
      process.exit(0);
    }

    // Crear el admin
    const admin = new Empleado({
      nombre: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
      rol: 'admin',
      estado: 'activo',
      salario: 0,
      fechaContratacion: new Date()
    });

    await admin.save();
    console.log('Administrador creado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

crearAdmin(); 