const Venta = require('../models/ventaModel');
const Producto = require('../models/productoModel');

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('vendedor', 'nombre email')
      .populate('cliente', 'nombre email')
      .populate('productos.producto', 'nombre precio');

    res.json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
      error: error.message
    });
  }
};

// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('vendedor', 'nombre email')
      .populate('cliente', 'nombre email')
      .populate('productos.producto', 'nombre precio');

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.json({
      success: true,
      data: venta
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
      error: error.message
    });
  }
};

// Crear nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const { productos, cliente, metodoPago } = req.body;

    // Calcular total y verificar stock
    let total = 0;
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `Producto ${item.producto} no encontrado`
        });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto ${producto.nombre}`
        });
      }
      total += producto.precio * item.cantidad;

      // Actualizar stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Crear venta
    const venta = await Venta.create({
      ...req.body,
      total,
      vendedor: req.user._id,
      fecha: new Date()
    });

    res.status(201).json({
      success: true,
      data: venta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear venta',
      error: error.message
    });
  }
};

// Actualizar venta
exports.actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    res.json({
      success: true,
      data: venta
    });
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar venta',
      error: error.message
    });
  }
};

// Eliminar venta
exports.eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndDelete(req.params.id);
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Venta eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar venta',
      error: error.message
    });
  }
};

// Cancelar venta
exports.cancelarVenta = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    if (venta.estado === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'La venta ya está cancelada'
      });
    }

    // Restaurar stock
    for (const item of venta.productos) {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        producto.stock += item.cantidad;
        await producto.save();
      }
    }

    venta.estado = 'cancelada';
    venta.fechaCancelacion = new Date();
    await venta.save();

    res.json({
      success: true,
      data: venta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar venta',
      error: error.message
    });
  }
};

// Obtener ventas por periodo
exports.obtenerVentasPorPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const ventas = await Venta.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      }
    })
      .populate('vendedor', 'nombre email')
      .populate('cliente', 'nombre email')
      .populate('productos.producto', 'nombre precio');

    res.json({
      success: true,
      data: ventas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas por periodo',
      error: error.message
    });
  }
}; 