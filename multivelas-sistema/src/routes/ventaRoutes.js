const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  cancelarVenta,
  obtenerVentasPorPeriodo,
  actualizarVenta,
  eliminarVenta
} = require('../controllers/ventaController');

// Rutas públicas
router.post('/registro', auth, checkRole(['admin', 'vendedor']), crearVenta);

// Rutas protegidas
router.use(auth);

// Rutas que requieren rol de vendedor o administrador
router.get('/', checkRole(['admin', 'vendedor']), obtenerVentas);
router.get('/:id', checkRole(['admin', 'vendedor']), obtenerVentaPorId);
router.post('/', checkRole(['admin', 'vendedor']), crearVenta);
router.put('/:id', checkRole(['admin', 'vendedor']), actualizarVenta);
router.put('/:id/cancelar', checkRole(['admin', 'vendedor']), cancelarVenta);
router.delete('/:id', checkRole(['admin', 'vendedor']), eliminarVenta);
router.get('/fecha/periodo', checkRole(['admin', 'vendedor']), obtenerVentasPorPeriodo);

module.exports = router; 