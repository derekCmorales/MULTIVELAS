# 🕯️ MULTIVELAS - Enterprise Management System

![MULTIVELAS Logo](logo.png)

A comprehensive enterprise management system for MULTIVELAS, built with modern web technologies. Manage inventory, sales, human resources, and finances all in one integrated platform.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 📦 Inventory Management
- Complete product lifecycle management
- Real-time stock control
- Product categorization
- Price tracking and history
- Low stock alerts

### 💰 Sales Module
- Integrated sales workflow
- Automatic VAT/IVA calculation
- Invoice generation
- Automatic stock updates
- Sales analytics

### 👥 Human Resources
- Employee management
- Payroll processing
- Banking information
- Role-based access control
- Department organization

### 📊 Financial Module
- General balance sheet
- Income and expense tracking
- Transaction management
- Financial reports
- Period-based analysis

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v4.18
- **Database:** MongoDB v6.0
- **ODM:** Mongoose v7.0
- **Authentication:** JWT
- **Security:** Helmet, CORS, bcryptjs
- **Validation:** Express-validator

### Frontend
- **Framework:** React v18.2
- **Language:** TypeScript v5.2
- **Build Tool:** Vite v5.1
- **UI Library:** Material-UI (MUI) v5.15
- **State Management:** Redux Toolkit v2.1
- **Routing:** React Router v6.22
- **Form Handling:** Formik + Yup
- **HTTP Client:** Axios v1.6

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Process Manager:** PM2
- **Web Server:** Nginx

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Node.js v18+ & MongoDB v6+

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/derekCmorales/MULTIVELAS.git
cd MULTIVELAS

# Setup environment variables
cp .env.example .env
cp multivelas-sistema/.env.example multivelas-sistema/.env
cp multivelas-frontend/.env.example multivelas-frontend/.env

# Start with deployment script
./deploy.sh

# OR manually
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- MongoDB: localhost:27017

### Option 2: Local Development

#### Backend Setup
```bash
cd multivelas-sistema
npm install
cp .env.example .env
npm start
```

#### Frontend Setup
```bash
cd multivelas-frontend
npm install
cp .env.example .env
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Create Admin User

```bash
# Docker
docker-compose exec backend npm run crear-admin

# Local
cd multivelas-sistema
npm run crear-admin
```

## 📚 Documentation

- **[🚀 Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[📖 Deployment Guide](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment documentation
  - Free hosting options (MongoDB Atlas, Render, Vercel)
  - Cost analysis and recommendations
  - Production best practices
  - Multiple deployment strategies

## 🌐 Deployment

### Free Tier Deployment ($0/month)

Deploy for free using:
- **Database:** MongoDB Atlas (Free tier - 512MB)
- **Backend:** Render.com (Free tier)
- **Frontend:** Render.com or Vercel (Free tier)

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.**

### Production Deployment

#### Budget Option (~$16/month)
- MongoDB Atlas M2: $9/month
- Render.com Web Service: $7/month
- Render.com Static Site: Free

#### Enterprise Option (~$70-350/month)
- VPS or Cloud Infrastructure
- Managed MongoDB
- CDN & Load Balancing
- Monitoring & Backups

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for all options and cost analysis.**

## 📡 API Reference

### Products
```
GET    /api/productos              - Get all products
GET    /api/productos/:id          - Get product by ID
POST   /api/productos              - Create product
PUT    /api/productos/:id          - Update product
DELETE /api/productos/:id          - Delete product
PUT    /api/productos/:id/stock    - Update stock
GET    /api/productos/categoria/:categoria - Get by category
```

### Sales
```
GET    /api/ventas                 - Get all sales
GET    /api/ventas/:id             - Get sale by ID
POST   /api/ventas                 - Create sale
PUT    /api/ventas/:id/cancelar    - Cancel sale
GET    /api/ventas/fecha/periodo   - Get sales by period
```

### Employees
```
GET    /api/empleados              - Get all employees
GET    /api/empleados/:id          - Get employee by ID
POST   /api/empleados              - Create employee
PUT    /api/empleados/:id          - Update employee
DELETE /api/empleados/:id          - Delete employee
GET    /api/empleados/rol/:rol     - Get by role
PUT    /api/empleados/:id/datos-bancarios - Update banking info
GET    /api/empleados/nomina       - Get payroll
```

### Financial
```
GET    /api/financiero/balance     - Get general balance
POST   /api/financiero/transaccion - Register transaction
GET    /api/financiero/transacciones/periodo - Get transactions by period
GET    /api/financiero/resumen     - Get financial summary
POST   /api/financiero/balance     - Create balance
GET    /api/financiero/balances/periodo - Get balances by period
```

### Clients
```
GET    /api/clientes               - Get all clients
GET    /api/clientes/:id           - Get client by ID
POST   /api/clientes               - Create client
PUT    /api/clientes/:id           - Update client
DELETE /api/clientes/:id           - Delete client
```

## 🏗️ Project Structure

```
MULTIVELAS/
├── multivelas-sistema/          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── scripts/           # Utility scripts
│   │   └── index.js           # Entry point
│   ├── Dockerfile
│   └── package.json
├── multivelas-frontend/         # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Redux store
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx            # Main app component
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/workflows/           # CI/CD workflows
├── docker-compose.yml           # Docker orchestration
├── deploy.sh                    # Deployment script
├── DEPLOYMENT_GUIDE.md          # Full deployment guide
├── QUICKSTART.md                # Quick start guide
└── README.md                    # This file
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization
- MongoDB injection prevention
- Rate limiting ready

## 📊 Database Schema

### Products (productos)
- name, description, price, category
- stock, stockMin, stockMax
- sku, barcode
- image, status
- timestamps

### Sales (ventas)
- products[], subtotal, iva, total
- client, seller, paymentMethod
- status, timestamps

### Employees (empleados)
- personalInfo (name, email, phone, address)
- jobInfo (position, department, salary)
- bankingInfo (bank, account, clabe)
- role, status, timestamps

### Financial (financiero)
- type (income/expense)
- category, amount, description
- date, reference
- balance records

## 🧪 Testing

```bash
# Backend tests
cd multivelas-sistema
npm test

# Frontend build test
cd multivelas-frontend
npm run build
```

## 🛠️ Development

### Backend Development
```bash
cd multivelas-sistema
npm run dev    # Start with nodemon
```

### Frontend Development
```bash
cd multivelas-frontend
npm run dev    # Start Vite dev server
```

### Linting
```bash
cd multivelas-frontend
npm run lint   # ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/multivelas
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

### Docker Compose (.env)
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme
JWT_SECRET=your_jwt_secret_here
VITE_API_URL=http://localhost:4000
```

## 📈 Monitoring & Maintenance

### Health Checks
- Backend: http://localhost:4000/
- Frontend: http://localhost:3000/

### Logs
```bash
# Docker
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2 (VPS deployment)
pm2 logs multivelas-backend
```

### Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/multivelas" --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/multivelas" /backups/20241212
```

## 💡 Support & Resources

- **Documentation:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Issues:** [GitHub Issues](https://github.com/derekCmorales/MULTIVELAS/issues)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Node.js and Express.js communities
- React and TypeScript teams
- MongoDB team
- Material-UI contributors
- All open source contributors

---

**Built with ❤️ for MULTIVELAS**

For deployment assistance, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
