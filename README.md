# Sistema de Gestión Multivelas

Sistema integral de gestión empresarial para Multivelas, desarrollado con Node.js, Express y MongoDB.

## Características

- **Módulo de Inventario**

  - Gestión completa de productos
  - Control de stock
  - Categorización de productos
  - Seguimiento de precios

- **Módulo de Ventas**

  - Proceso de venta integrado
  - Cálculo automático de IVA
  - Gestión de facturas
  - Control de stock automático

- **Módulo de Recursos Humanos**

  - Gestión de empleados
  - Control de nómina
  - Datos bancarios
  - Roles y permisos

- **Módulo Financiero**
  - Balance general
  - Control de ingresos y egresos
  - Gestión de transacciones
  - Reportes financieros

## Requisitos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/multivelas-sistema.git
cd multivelas-sistema
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
MONGODB_URI=mongodb://localhost:27017/multivelas
PORT=5000
JWT_SECRET=tu_secreto_jwt
NODE_ENV=development
```

4. Iniciar el servidor:

```bash
npm start
```

## API Endpoints

### Productos

- GET /api/productos - Obtener todos los productos
- GET /api/productos/:id - Obtener un producto específico
- POST /api/productos - Crear nuevo producto
- PUT /api/productos/:id - Actualizar producto
- DELETE /api/productos/:id - Eliminar producto
- PUT /api/productos/:id/stock - Actualizar stock
- GET /api/productos/categoria/:categoria - Obtener productos por categoría

### Ventas

- GET /api/ventas - Obtener todas las ventas
- GET /api/ventas/:id - Obtener una venta específica
- POST /api/ventas - Crear nueva venta
- PUT /api/ventas/:id/cancelar - Cancelar venta
- GET /api/ventas/fecha/periodo - Obtener ventas por período

### Empleados

- GET /api/empleados - Obtener todos los empleados
- GET /api/empleados/:id - Obtener un empleado específico
- POST /api/empleados - Crear nuevo empleado
- PUT /api/empleados/:id - Actualizar empleado
- DELETE /api/empleados/:id - Eliminar empleado
- GET /api/empleados/rol/:rol - Obtener empleados por rol
- PUT /api/empleados/:id/datos-bancarios - Actualizar datos bancarios
- GET /api/empleados/nomina - Obtener nómina

### Financiero

- GET /api/financiero/balance - Obtener balance general
- POST /api/financiero/transaccion - Registrar nueva transacción
- GET /api/financiero/transacciones/periodo - Obtener transacciones por período
- GET /api/financiero/resumen - Obtener resumen financiero
- POST /api/financiero/balance - Crear nuevo balance
- GET /api/financiero/balances/periodo - Obtener balances por período

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones
├── controllers/    # Controladores
├── models/        # Modelos de MongoDB
├── routes/        # Rutas de la API
├── middleware/    # Middleware
├── utils/         # Utilidades
└── index.js       # Punto de entrada
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
