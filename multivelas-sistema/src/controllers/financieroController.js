const Financiero = require('../models/financieroModel');

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Financiero.find().sort({ fecha: -1 });
    // Formatear los montos con el símbolo Q
    const transaccionesFormateadas = transacciones.map(t => ({
      ...t.toObject(),
      monto: `Q${t.monto.toFixed(2)}`
    }));
    res.json({
      success: true,
      data: transaccionesFormateadas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones',
      error: error.message
    });
  }
};

// Obtener transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Financiero.findById(req.params.id);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }
    // Formatear el monto con el símbolo Q
    const transaccionFormateada = {
      ...transaccion.toObject(),
      monto: `Q${transaccion.monto.toFixed(2)}`
    };
    res.json({
      success: true,
      data: transaccionFormateada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacción',
      error: error.message
    });
  }
};

// Crear nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    // Convertir el monto de string a número si viene con el símbolo Q
    if (typeof req.body.monto === 'string' && req.body.monto.startsWith('Q')) {
      req.body.monto = parseFloat(req.body.monto.substring(1));
    }
    const transaccion = await Financiero.create(req.body);
    // Formatear el monto con el símbolo Q
    const transaccionFormateada = {
      ...transaccion.toObject(),
      monto: `Q${transaccion.monto.toFixed(2)}`
    };
    res.status(201).json({
      success: true,
      data: transaccionFormateada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear transacción',
      error: error.message
    });
  }
};

// Actualizar transacción
exports.actualizarTransaccion = async (req, res) => {
  try {
    // Convertir el monto de string a número si viene con el símbolo Q
    if (typeof req.body.monto === 'string' && req.body.monto.startsWith('Q')) {
      req.body.monto = parseFloat(req.body.monto.substring(1));
    }
    const transaccion = await Financiero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }
    // Formatear el monto con el símbolo Q
    const transaccionFormateada = {
      ...transaccion.toObject(),
      monto: `Q${transaccion.monto.toFixed(2)}`
    };
    res.json({
      success: true,
      data: transaccionFormateada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar transacción',
      error: error.message
    });
  }
};

// Eliminar transacción
exports.eliminarTransaccion = async (req, res) => {
  try {
    const transaccion = await Financiero.findByIdAndDelete(req.params.id);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Transacción eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar transacción',
      error: error.message
    });
  }
};

// Obtener resumen financiero
exports.obtenerResumen = async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const query = {};
    
    if (inicio && fin) {
      query.fecha = {
        $gte: new Date(inicio),
        $lte: new Date(fin)
      };
    }

    const transacciones = await Financiero.find(query);
    
    const resumen = {
      ingresos: transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((acc, t) => acc + t.monto, 0),
      egresos: transacciones
        .filter(t => t.tipo === 'egreso')
        .reduce((acc, t) => acc + t.monto, 0),
      balance: transacciones
        .reduce((acc, t) => acc + (t.tipo === 'ingreso' ? t.monto : -t.monto), 0),
      totalTransacciones: transacciones.length,
      porCategoria: {}
    };

    // Calcular totales por categoría
    transacciones.forEach(t => {
      if (!resumen.porCategoria[t.categoria]) {
        resumen.porCategoria[t.categoria] = {
          ingresos: 0,
          egresos: 0,
          balance: 0
        };
      }
      if (t.tipo === 'ingreso') {
        resumen.porCategoria[t.categoria].ingresos += t.monto;
      } else {
        resumen.porCategoria[t.categoria].egresos += t.monto;
      }
      resumen.porCategoria[t.categoria].balance += t.tipo === 'ingreso' ? t.monto : -t.monto;
    });

    // Formatear los montos con el símbolo Q
    resumen.ingresos = `Q${resumen.ingresos.toFixed(2)}`;
    resumen.egresos = `Q${resumen.egresos.toFixed(2)}`;
    resumen.balance = `Q${resumen.balance.toFixed(2)}`;

    // Formatear los montos por categoría
    Object.keys(resumen.porCategoria).forEach(categoria => {
      resumen.porCategoria[categoria].ingresos = `Q${resumen.porCategoria[categoria].ingresos.toFixed(2)}`;
      resumen.porCategoria[categoria].egresos = `Q${resumen.porCategoria[categoria].egresos.toFixed(2)}`;
      resumen.porCategoria[categoria].balance = `Q${resumen.porCategoria[categoria].balance.toFixed(2)}`;
    });

    res.json({
      success: true,
      data: resumen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen financiero',
      error: error.message
    });
  }
}; 