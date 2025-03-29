const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { auth, checkRole } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', auth, checkRole(['admin']), productoController.crearProducto);

// Rutas protegidas
router.use(auth);

// Rutas que requieren rol de administrador
router.get('/', checkRole(['admin']), productoController.obtenerProductos);
router.get('/:id', checkRole(['admin']), productoController.obtenerProductoPorId);
router.put('/:id', checkRole(['admin']), productoController.actualizarProducto);
router.delete('/:id', checkRole(['admin']), productoController.eliminarProducto);
router.get('/categoria/:categoria', checkRole(['admin']), productoController.obtenerProductosPorCategoria);

module.exports = router; 