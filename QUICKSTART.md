# 🚀 Quick Start Deployment Guide

This is a simplified guide to get MULTIVELAS running quickly. For comprehensive deployment options, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Prerequisites

- Docker & Docker Compose (recommended)
- OR Node.js v18+ & MongoDB v6+

---

## Option 1: Docker Deployment (Easiest - Recommended)

### 1. Install Docker
```bash
# macOS
brew install --cask docker

# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Clone and Configure
```bash
git clone https://github.com/derekCmorales/MULTIVELAS.git
cd MULTIVELAS

# Create environment files from templates
cp .env.example .env
cp multivelas-sistema/.env.example multivelas-sistema/.env
cp multivelas-frontend/.env.example multivelas-frontend/.env

# Edit .env files with your settings (optional for local testing)
```

### 3. Deploy
```bash
# Use the deployment script
./deploy.sh

# OR manually with Docker Compose
docker-compose up -d
```

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **MongoDB:** localhost:27017

---

## Option 2: Free Cloud Deployment (Render.com)

### 1. Setup MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create free cluster (M0)
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Copy connection string

### 2. Deploy Backend (Render.com)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Root Directory:** `multivelas-sistema`
   - **Build:** `npm install`
   - **Start:** `npm start`
5. Environment Variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_secure_random_64_char_string
   NODE_ENV=production
   ```
6. Deploy!

### 3. Deploy Frontend (Render.com)
1. New → Static Site
2. Connect same GitHub repository
3. Settings:
   - **Root Directory:** `multivelas-frontend`
   - **Build:** `npm install && npm run build`
   - **Publish:** `dist`
4. Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy!

**Cost:** $0/month (Free tier)

---

## Option 3: Local Development

### 1. Install MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

### 2. Setup Backend
```bash
cd multivelas-sistema
npm install
cp .env.example .env
# Edit .env if needed
npm start
```

### 3. Setup Frontend
```bash
cd multivelas-frontend
npm install
cp .env.example .env
# Edit VITE_API_URL to http://localhost:4000
npm run dev
```

### 4. Access
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000

---

## 🔐 Create Admin User

After deployment, create an admin user:

```bash
# Docker
docker-compose exec backend npm run crear-admin

# Local
cd multivelas-sistema
npm run crear-admin
```

---

## 📊 Cost Comparison

| Option | Monthly Cost | Best For |
|--------|-------------|----------|
| **Free Tier** | $0 | Testing, small projects |
| **Budget Production** | $16 | Small businesses |
| **Medium Business** | $70-100 | Growing companies |
| **Enterprise** | $270-500+ | Large organizations |

---

## 🆘 Troubleshooting

### Backend won't connect to MongoDB
```bash
# Check MongoDB is running
docker-compose ps
# OR for local MongoDB
sudo systemctl status mongod

# Verify connection string in .env
```

### Frontend can't reach backend
1. Check `VITE_API_URL` in frontend `.env`
2. Verify backend is running
3. Check browser console for CORS errors

### Port already in use
```bash
# Change ports in docker-compose.yml
# OR kill process using the port
lsof -ti:4000 | xargs kill -9
```

---

## 📚 Next Steps

1. ✅ Deploy the application
2. 📖 Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production setup
3. 🔒 Configure SSL/HTTPS
4. 📊 Set up monitoring
5. 💾 Configure backups

---

## 🌟 Recommended Stack for Production

**For Small Business (Budget-friendly):**
- **Frontend:** Render.com or Vercel (Free)
- **Backend:** Render.com ($7/month)
- **Database:** MongoDB Atlas M2 ($9/month)
- **Total:** ~$16/month

**For Medium/Large Business:**
- **Infrastructure:** DigitalOcean/AWS
- **Database:** MongoDB Atlas M10+ ($57/month)
- **CDN:** Cloudflare (Free)
- **Monitoring:** UptimeRobot (Free)
- **Total:** ~$70-100/month

---

## 📞 Support Resources

- 📖 [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- 🐳 [Docker Documentation](https://docs.docker.com/)
- 🍃 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- 🚂 [Render.com Docs](https://render.com/docs)

---

**Ready to deploy?** Start with Docker for local testing, then move to cloud platforms for production!
