const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Rutas públicas
router.post('/registro', auth, checkRole(['admin']), clienteController.crearCliente);

// Rutas protegidas
router.use(auth);

// Rutas que requieren rol de administrador
router.get('/', checkRole(['admin']), clienteController.obtenerClientes);
router.get('/:id', checkRole(['admin']), clienteController.obtenerClientePorId);
router.put('/:id', checkRole(['admin']), clienteController.actualizarCliente);
router.delete('/:id', checkRole(['admin']), clienteController.eliminarCliente);
router.put('/:id/puntos', checkRole(['admin']), clienteController.actualizarPuntos);
router.get('/tipo/:tipo', checkRole(['admin']), clienteController.obtenerClientesPorTipo);
router.get('/nivel/:nivel', checkRole(['admin']), clienteController.obtenerClientesPorNivel);

module.exports = router; 