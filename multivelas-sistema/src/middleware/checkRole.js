exports.checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.empleado) {
        return res.status(401).json({ mensaje: 'No autorizado - No hay empleado autenticado' });
      }

      if (!roles.includes(req.empleado.rol)) {
        return res.status(403).json({
          mensaje: 'Acceso denegado - No tiene los permisos necesarios',
          rolRequerido: roles,
          rolActual: req.empleado.rol
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al verificar roles', error: error.message });
    }
  };
}; 