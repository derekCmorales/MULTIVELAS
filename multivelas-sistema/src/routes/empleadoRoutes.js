const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const { auth, checkRole } = require('../middleware/auth');

// Rutas públicas
router.post('/login', empleadoController.login);

// Rutas que requieren autenticación
router.get('/', auth, checkRole(['admin']), empleadoController.obtenerEmpleados);
router.get('/perfil', auth, empleadoController.obtenerPerfil);
router.get('/rol/:rol', auth, checkRole(['admin']), empleadoController.obtenerEmpleadosPorRol);
router.get('/nomina', auth, checkRole(['admin']), empleadoController.obtenerNomina);
router.get('/:id', auth, empleadoController.obtenerEmpleadoPorId);
router.post('/registro', auth, checkRole(['admin']), empleadoController.crearEmpleado);
router.put('/:id', auth, checkRole(['admin']), empleadoController.actualizarEmpleado);
router.delete('/:id', auth, checkRole(['admin']), empleadoController.eliminarEmpleado);
router.put('/:id/datos-bancarios', auth, checkRole(['admin']), empleadoController.actualizarDatosBancarios);

module.exports = router; 