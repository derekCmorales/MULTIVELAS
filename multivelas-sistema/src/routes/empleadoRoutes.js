const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const upload = require('../middleware/upload');

// Rutas públicas
router.post('/login', empleadoController.login);

// Rutas protegidas
router.get('/perfil/me', auth, empleadoController.obtenerPerfil);
router.get('/rol/:rol', auth, checkRole(['admin']), empleadoController.obtenerEmpleadosPorRol);
router.get('/nomina', auth, checkRole(['admin', 'financiero']), empleadoController.obtenerNomina);
router.get('/', auth, checkRole(['admin']), empleadoController.obtenerEmpleados);
router.get('/:id', auth, checkRole(['admin']), empleadoController.obtenerEmpleadoPorId);
router.post('/registro', auth, checkRole(['admin']), upload.single('foto'), empleadoController.crearEmpleado);
router.put('/:id', auth, checkRole(['admin']), upload.single('foto'), empleadoController.actualizarEmpleado);
router.delete('/:id', auth, checkRole(['admin']), empleadoController.eliminarEmpleado);
router.post('/:id/cambiar-password', auth, empleadoController.cambiarPassword);
router.put('/:id/datos-bancarios', auth, checkRole(['admin', 'financiero']), empleadoController.actualizarDatosBancarios);

module.exports = router; 