const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

console.log('Iniciando servidor...');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Middleware configurado');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

// Rutas
console.log('Configurando rutas...');
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/ventas', require('./routes/ventaRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/empleados', require('./routes/empleadoRoutes'));
app.use('/api/financiero', require('./routes/financieroRoutes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: err.message });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 4000;
console.log(`Iniciando servidor en puerto ${PORT}...`);

// Conexión a MongoDB
console.log('Intentando conectar a MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida');
    // Iniciar el servidor solo después de conectar a MongoDB
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Rutas disponibles:');
      console.log('- GET /');
      console.log('- GET /api/productos');
      console.log('- GET /api/ventas');
      console.log('- GET /api/clientes');
      console.log('- GET /api/empleados');
      console.log('- GET /api/financiero');
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });
