const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'No autorizado - No hay empleado autenticado' 
        });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ 
          success: false,
          message: 'No autorizado - Rol no permitido' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Error al verificar rol', 
        error: error.message 
      });
    }
  };
};

module.exports = checkRole; 