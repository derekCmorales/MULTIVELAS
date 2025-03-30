const Empleado = require('../models/empleadoModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().select('-password');
    res.json({
      success: true,
      data: empleados
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener empleados', 
      error: error.message 
    });
  }
};

// Obtener empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).select('-password');
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        message: 'Empleado no encontrado' 
      });
    }
    res.json({
      success: true,
      data: empleado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener empleado', 
      error: error.message 
    });
  }
};

// Crear nuevo empleado
exports.crearEmpleado = async (req, res) => {
  try {
    const empleadoData = { ...req.body };

    // Procesar campos JSON
    if (empleadoData.contactoEmergencia) {
      empleadoData.contactoEmergencia = JSON.parse(empleadoData.contactoEmergencia);
    }
    if (empleadoData.direccion) {
      empleadoData.direccion = JSON.parse(empleadoData.direccion);
    }
    if (empleadoData.horarioTrabajo) {
      empleadoData.horarioTrabajo = JSON.parse(empleadoData.horarioTrabajo);
    }
    if (empleadoData.documentos) {
      empleadoData.documentos = JSON.parse(empleadoData.documentos);
    }

    // Procesar fechas
    if (empleadoData.fechaNacimiento) {
      empleadoData.fechaNacimiento = new Date(empleadoData.fechaNacimiento);
    }
    if (empleadoData.fechaContratacion) {
      empleadoData.fechaContratacion = new Date(empleadoData.fechaContratacion);
    }
    if (empleadoData.fechaFinContrato) {
      empleadoData.fechaFinContrato = new Date(empleadoData.fechaFinContrato);
    }

    // Manejar el campo supervisor
    if (!empleadoData.supervisor || empleadoData.supervisor === '') {
      delete empleadoData.supervisor;
    }

    // Verificar si el empleado ya existe
    const empleadoExistente = await Empleado.findOne({
      $or: [
        { email: empleadoData.email },
        { dpi: empleadoData.dpi },
        { numeroEmpleado: empleadoData.numeroEmpleado }
      ]
    });

    if (empleadoExistente) {
      return res.status(400).json({ 
        success: false,
        message: 'Ya existe un empleado con ese email, DPI o número de empleado' 
      });
    }

    // Procesar la foto si existe
    if (req.file) {
      empleadoData.foto = req.file.filename;
    }

    // Crear nuevo empleado
    const empleado = new Empleado(empleadoData);
    await empleado.save();

    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: empleado
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error al crear empleado', 
      error: error.message 
    });
  }
};

// Actualizar empleado
exports.actualizarEmpleado = async (req, res) => {
  try {
    const empleadoData = { ...req.body };

    // Procesar campos JSON
    if (empleadoData.contactoEmergencia) {
      empleadoData.contactoEmergencia = JSON.parse(empleadoData.contactoEmergencia);
    }
    if (empleadoData.direccion) {
      empleadoData.direccion = JSON.parse(empleadoData.direccion);
    }
    if (empleadoData.horarioTrabajo) {
      empleadoData.horarioTrabajo = JSON.parse(empleadoData.horarioTrabajo);
    }
    if (empleadoData.documentos) {
      empleadoData.documentos = JSON.parse(empleadoData.documentos);
    }
    if (empleadoData.datosBancarios) {
      empleadoData.datosBancarios = JSON.parse(empleadoData.datosBancarios);
    }

    // Procesar fechas
    if (empleadoData.fechaNacimiento) {
      empleadoData.fechaNacimiento = new Date(empleadoData.fechaNacimiento);
    }
    if (empleadoData.fechaContratacion) {
      empleadoData.fechaContratacion = new Date(empleadoData.fechaContratacion);
    }
    if (empleadoData.fechaFinContrato) {
      empleadoData.fechaFinContrato = new Date(empleadoData.fechaFinContrato);
    }

    // Manejar el campo supervisor
    if (!empleadoData.supervisor || empleadoData.supervisor === '') {
      delete empleadoData.supervisor;
    }

    // Procesar la foto si existe
    if (req.file) {
      empleadoData.foto = req.file.filename;
    }

    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      empleadoData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        message: 'Empleado no encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Empleado actualizado exitosamente', 
      data: empleado 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error al actualizar empleado', 
      error: error.message 
    });
  }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        message: 'Empleado no encontrado' 
      });
    }

    // Eliminar la foto si existe
    if (empleado.foto) {
      const fotoPath = path.join(__dirname, '..', '..', 'uploads', empleado.foto);
      fs.unlinkSync(fotoPath);
    }

    await empleado.remove();

    res.json({ 
      success: true,
      message: 'Empleado eliminado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar empleado', 
      error: error.message 
    });
  }
};

// Login de empleado
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione email y contraseña'
      });
    }

    // Buscar empleado por email y seleccionar explícitamente el campo password
    const empleado = await Empleado.findOne({ email });
    if (!empleado) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const esPasswordValido = await empleado.compararPassword(password);
    if (!esPasswordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el empleado está activo
    if (empleado.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        message: 'La cuenta está inactiva'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: empleado._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta sin la contraseña
    const empleadoSinPassword = empleado.toObject();
    delete empleadoSinPassword.password;

    res.json({
      success: true,
      data: {
        token,
        empleado: empleadoSinPassword
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    const empleado = await Empleado.findById(req.params.id).select('+password');

    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        message: 'Empleado no encontrado' 
      });
    }

    // Verificar contraseña actual
    const esPasswordValido = await empleado.compararPassword(passwordActual);
    if (!esPasswordValido) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    empleado.password = nuevaPassword;
    await empleado.save();

    res.json({ 
      success: true,
      message: 'Contraseña actualizada exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al cambiar contraseña', 
      error: error.message 
    });
  }
};

// Obtener empleados por rol
exports.obtenerEmpleadosPorRol = async (req, res) => {
  try {
    const empleados = await Empleado.find({ rol: req.params.rol }).select('-password');
    res.json({
      success: true,
      data: empleados
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener empleados por rol', 
      error: error.message 
    });
  }
};

// Obtener perfil del empleado autenticado
exports.obtenerPerfil = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.user._id).select('-password');
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    res.json({
      success: true,
      data: empleado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// Actualizar datos bancarios del empleado
exports.actualizarDatosBancarios = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      { datosBancarios: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        message: 'Empleado no encontrado' 
      });
    }
    res.json({ 
      success: true,
      message: 'Datos bancarios actualizados exitosamente', 
      data: empleado 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error al actualizar datos bancarios', 
      error: error.message 
    });
  }
};

// Obtener nómina
exports.obtenerNomina = async (req, res) => {
  try {
    const empleados = await Empleado.find({ estado: 'activo' })
      .select('nombreCompleto sueldoBase datosBancarios')
      .sort('nombreCompleto');

    res.json({
      success: true,
      data: empleados
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener nómina', 
      error: error.message 
    });
  }
}; 