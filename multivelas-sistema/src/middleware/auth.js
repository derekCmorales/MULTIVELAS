const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleadoModel');

const auth = async (req, res, next) => {
  try {
    let token;

    // Verificar si existe el token en el header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado - Token no proporcionado' });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener empleado del token
      const empleado = await Empleado.findById(decoded.id).select('-password');
      if (!empleado) {
        return res.status(401).json({ mensaje: 'No autorizado - Empleado no encontrado' });
      }

      // Verificar si el empleado está activo
      if (empleado.estado !== 'activo') {
        return res.status(401).json({ mensaje: 'No autorizado - Cuenta inactiva' });
      }

      // Agregar empleado a la request
      req.user = empleado;
      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'No autorizado - Token inválido' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la autenticación', error: error.message });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ mensaje: 'No autorizado - No hay empleado autenticado' });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ mensaje: 'No autorizado - Rol no permitido' });
      }

      next();
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al verificar rol', error: error.message });
    }
  };
};

module.exports = { auth, checkRole }; 