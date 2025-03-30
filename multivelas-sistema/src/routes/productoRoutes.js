const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { auth, checkRole } = require('../middleware/auth');

// Rutas que requieren autenticación
router.get('/', auth, productoController.obtenerProductos);
router.get('/:id', auth, productoController.obtenerProductoPorId);
router.post('/', auth, checkRole(['admin']), productoController.crearProducto);
router.put('/:id', auth, checkRole(['admin']), productoController.actualizarProducto);
router.delete('/:id', auth, checkRole(['admin']), productoController.eliminarProducto);
router.get('/categoria/:categoria', auth, productoController.obtenerProductosPorCategoria);

module.exports = router; 