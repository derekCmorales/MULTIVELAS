const Cliente = require('../models/clienteModel');

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
};

// Crear nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
};

// Actualizar cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

// Actualizar puntos del cliente
exports.actualizarPuntos = async (req, res) => {
  try {
    const { puntos } = req.body;
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    cliente.puntos += puntos;

    // Actualizar nivel de distribuidor basado en puntos
    if (cliente.tipoCliente === 'distribuidor') {
      if (cliente.puntos >= 10000) cliente.nivelDistribuidor = 'platino';
      else if (cliente.puntos >= 5000) cliente.nivelDistribuidor = 'oro';
      else if (cliente.puntos >= 2500) cliente.nivelDistribuidor = 'plata';
      else if (cliente.puntos >= 1000) cliente.nivelDistribuidor = 'bronce';
    }

    await cliente.save();

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar puntos',
      error: error.message
    });
  }
};

// Obtener clientes por tipo
exports.obtenerClientesPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const clientes = await Cliente.find({ tipoCliente: tipo });
    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes por tipo',
      error: error.message
    });
  }
};

// Obtener clientes por nivel de distribuidor
exports.obtenerClientesPorNivel = async (req, res) => {
  try {
    const { nivel } = req.params;
    const clientes = await Cliente.find({ nivelDistribuidor: nivel });
    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes por nivel',
      error: error.message
    });
  }
}; 