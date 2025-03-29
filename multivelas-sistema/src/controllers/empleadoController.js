const Empleado = require('../models/empleadoModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().select('-password');
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
  }
};

// Obtener empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).select('-password');
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleado', error: error.message });
  }
};

// Crear nuevo empleado
exports.crearEmpleado = async (req, res) => {
  try {
    const empleado = new Empleado(req.body);
    await empleado.save();
    res.status(201).json({ mensaje: 'Empleado creado exitosamente', empleado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear empleado', error: error.message });
  }
};

// Actualizar empleado
exports.actualizarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json({ mensaje: 'Empleado actualizado exitosamente', empleado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar empleado', error: error.message });
  }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json({ mensaje: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar empleado', error: error.message });
  }
};

// Login de empleado
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el empleado existe
    const empleado = await Empleado.findOne({ email }).select('+password');
    if (!empleado) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esPasswordValido = await empleado.compararPassword(password);
    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar si el empleado está activo
    if (empleado.estado !== 'activo') {
      return res.status(401).json({ mensaje: 'Cuenta inactiva' });
    }

    // Actualizar último acceso
    empleado.ultimoAcceso = new Date();
    await empleado.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: empleado._id, rol: empleado.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta sin el password
    const empleadoSinPassword = empleado.toObject();
    delete empleadoSinPassword.password;

    res.json({
      mensaje: 'Login exitoso',
      token,
      empleado: empleadoSinPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    const empleado = await Empleado.findById(req.params.id).select('+password');

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    // Verificar contraseña actual
    const esPasswordValido = await empleado.compararPassword(passwordActual);
    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    // Actualizar contraseña
    empleado.password = nuevaPassword;
    await empleado.save();

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar contraseña', error: error.message });
  }
};

// Obtener empleados por rol
exports.obtenerEmpleadosPorRol = async (req, res) => {
  try {
    const empleados = await Empleado.find({ rol: req.params.rol }).select('-password');
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
  }
};

exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el empleado ya existe
    const empleadoExistente = await Empleado.findOne({ email });
    if (empleadoExistente) {
      return res.status(400).json({ mensaje: 'El empleado ya existe' });
    }

    // Crear nuevo empleado con campos requeridos
    const empleado = new Empleado({
      nombre,
      email,
      password, // La contraseña se encriptará automáticamente en el middleware del modelo
      rol: rol || 'empleado',
      salario: 5000, // Valor por defecto
      fechaContratacion: new Date() // Fecha actual
    });

    await empleado.save();

    // Generar token
    const token = jwt.sign(
      { id: empleado._id, rol: empleado.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensaje: 'Empleado registrado exitosamente',
      token,
      empleado: {
        id: empleado._id,
        nombre: empleado.nombre,
        email: empleado.email,
        rol: empleado.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar empleado', error: error.message });
  }
};

// Obtener perfil del empleado
exports.obtenerPerfil = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.empleado.id).select('-password');
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
}; 