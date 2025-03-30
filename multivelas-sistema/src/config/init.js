const fs = require('fs');
const path = require('path');

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Directorio uploads creado');
}

module.exports = {
  uploadsDir
}; 