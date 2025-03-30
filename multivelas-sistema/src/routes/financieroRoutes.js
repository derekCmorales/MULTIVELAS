const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const {
  obtenerTransacciones,
  obtenerTransaccionPorId,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerResumen
} = require('../controllers/financieroController');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas que requieren rol de administrador o financiero
router.get('/transacciones', checkRole(['admin', 'financiero']), obtenerTransacciones);
router.get('/transacciones/:id', checkRole(['admin', 'financiero']), obtenerTransaccionPorId);
router.post('/transacciones', checkRole(['admin', 'financiero']), crearTransaccion);
router.put('/transacciones/:id', checkRole(['admin', 'financiero']), actualizarTransaccion);
router.delete('/transacciones/:id', checkRole(['admin', 'financiero']), eliminarTransaccion);

// Ruta para obtener resumen financiero
router.get('/resumen', checkRole(['admin', 'financiero']), obtenerResumen);

module.exports = router; 