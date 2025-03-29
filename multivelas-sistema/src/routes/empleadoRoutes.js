const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const { auth, checkRole } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', empleadoController.registro);
router.post('/login', empleadoController.login);

// Rutas protegidas
router.get('/perfil', auth, empleadoController.obtenerPerfil);
router.get('/', auth, checkRole(['admin']), empleadoController.obtenerEmpleados);
router.get('/:id', auth, empleadoController.obtenerEmpleadoPorId);
router.put('/:id', auth, checkRole(['admin']), empleadoController.actualizarEmpleado);
router.delete('/:id', auth, checkRole(['admin']), empleadoController.eliminarEmpleado);
router.put('/:id/cambiar-password', auth, empleadoController.cambiarPassword);
router.get('/rol/:rol', auth, checkRole(['admin']), empleadoController.obtenerEmpleadosPorRol);

module.exports = router; 