# 🚀 MULTIVELAS - Deployment Guide

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Free Deployment Options](#free-deployment-options)
5. [Cost Analysis](#cost-analysis)
6. [Step-by-Step Deployment](#step-by-step-deployment)
7. [Production Best Practices](#production-best-practices)

---

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js (v4.18.2)
- **Database:** MongoDB (v4.4+)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, bcryptjs
- **Dependencies:**
  - mongoose (v7.0.3) - MongoDB ODM
  - express-validator (v7.0.1) - Request validation
  - dotenv (v16.0.3) - Environment variables
  - morgan (v1.10.0) - HTTP logging
  - multer (v1.4.5) - File uploads

### Frontend
- **Framework:** React (v18.2.0)
- **Language:** TypeScript (v5.2.2)
- **Build Tool:** Vite (v5.1.0)
- **UI Framework:** Material-UI (MUI v5.15.10)
- **State Management:** Redux Toolkit (v2.1.0)
- **HTTP Client:** Axios (v1.6.7)
- **Routing:** React Router DOM (v6.22.1)
- **Form Handling:** Formik (v2.4.5) + Yup (v1.3.3)

### Development Tools
- **Backend Dev Server:** Nodemon
- **Testing:** Jest
- **Linting:** ESLint

---

## ✅ Prerequisites

### Local Development
- Node.js v14 or higher
- npm or yarn
- MongoDB v4.4 or higher (or MongoDB Atlas account)
- Git

### Production Deployment
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt provides free certificates)
- Server or cloud platform account

---

## 🌐 Deployment Options

### Option 1: Docker Deployment (Recommended)
**Pros:**
- Consistent environment across development and production
- Easy to scale
- Isolated dependencies
- Simple deployment and rollback

**Cons:**
- Requires Docker knowledge
- Slightly more resource-intensive

### Option 2: Traditional VPS Deployment
**Platforms:** DigitalOcean, Linode, Vultr, AWS EC2
**Pros:**
- Full control over server
- Customizable configuration
- Scalable

**Cons:**
- Requires server management skills
- Manual security updates needed

### Option 3: Platform-as-a-Service (PaaS)
**Platforms:** Render, Railway, Heroku, AWS Elastic Beanstalk
**Pros:**
- Automatic scaling
- Managed infrastructure
- Simple deployment (Git push)

**Cons:**
- Higher cost than VPS
- Less control

### Option 4: Serverless
**Platforms:** Vercel (frontend), AWS Lambda (backend)
**Pros:**
- Pay only for what you use
- Auto-scaling
- Zero server management

**Cons:**
- Cold start issues
- Vendor lock-in
- May require code modifications

---

## 💰 Free Deployment Options

### 🆓 100% Free Tier Options

#### 1. **MongoDB Atlas (Database)**
- **Free Tier:** 512MB storage
- **Suitable for:** Small to medium projects, development, testing
- **Limitations:** 512MB storage, shared cluster
- **Upgrade path:** $9/month for 2GB dedicated cluster
- **URL:** https://www.mongodb.com/cloud/atlas

#### 2. **Render.com (Backend + Frontend)**
- **Free Tier:** 
  - Static sites: Unlimited
  - Web services: 750 hours/month
  - Automatic SSL
  - Custom domains
- **Limitations:** Spins down after 15 minutes of inactivity
- **Upgrade path:** $7/month for always-on services
- **URL:** https://render.com

#### 3. **Railway.app (Full Stack)**
- **Free Tier:** $5 credit/month
- **Suitable for:** Small projects, development
- **Limitations:** Credit-based, may need to upgrade for production
- **Upgrade path:** Pay as you go
- **URL:** https://railway.app

#### 4. **Vercel (Frontend Only)**
- **Free Tier:** 
  - Unlimited deployments
  - Automatic SSL
  - Custom domains
  - Global CDN
- **Limitations:** Personal/hobby projects only
- **Perfect for:** React/Vite frontend
- **URL:** https://vercel.com

#### 5. **Netlify (Frontend Only)**
- **Free Tier:** 
  - 100GB bandwidth/month
  - Automatic SSL
  - Custom domains
  - Continuous deployment
- **URL:** https://netlify.com

### 🔄 Firebase Alternative Stack

While this project uses MongoDB (not Firestore), you can use:

**Free Tier Combination:**
- **Frontend:** Vercel or Netlify (Free)
- **Backend:** Render.com (Free tier)
- **Database:** MongoDB Atlas (Free tier - 512MB)
- **File Storage:** Cloudinary (Free - 25GB storage, 25GB bandwidth)
- **Email:** SendGrid (Free - 100 emails/day)

**Total Cost:** $0/month for small to medium traffic
**Upgrade Cost:** ~$16-25/month for production traffic

---

## 💵 Cost Analysis

### Small Business (< 1000 users/month)

#### Option A: Fully Free
- MongoDB Atlas: **$0** (Free tier)
- Render (Backend + Frontend): **$0** (Free tier)
- **Total: $0/month**
- **Limitations:** Backend sleeps after inactivity, limited resources

#### Option B: Budget Production
- MongoDB Atlas: **$9/month** (M2 cluster)
- Render Web Service: **$7/month** (always-on)
- Render Static Site: **$0** (Free)
- **Total: $16/month**
- **Best for:** Small businesses starting out

### Medium Business (1K-10K users/month)

#### Option C: VPS Deployment
- DigitalOcean Droplet (2GB RAM): **$12/month**
- MongoDB Atlas M10: **$57/month**
- Domain: **$12/year**
- **Total: ~$70/month**

#### Option D: PaaS + Managed DB
- Render (Backend): **$25/month** (4GB RAM)
- Vercel Pro (Frontend): **$20/month**
- MongoDB Atlas M10: **$57/month**
- **Total: ~$102/month**

### Large Enterprise (10K+ users/month)

#### Option E: Cloud Infrastructure
- AWS EC2 (t3.medium): **$30/month**
- AWS RDS for MongoDB Atlas M30: **$200+/month**
- CloudFront CDN: **$20-100/month**
- Load Balancer: **$20/month**
- **Total: ~$270-350/month**

---

## 📦 Step-by-Step Deployment

### 🐳 Deployment with Docker (Recommended)

#### Step 1: Prerequisites
```bash
# Install Docker and Docker Compose
# For Ubuntu/Debian:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# For macOS:
brew install --cask docker

# For Windows:
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

#### Step 2: Clone Repository
```bash
git clone https://github.com/derekCmorales/MULTIVELAS.git
cd MULTIVELAS
```

#### Step 3: Configure Environment Variables

Create `.env` files using the provided templates:

**Backend (.env in multivelas-sistema/):**
```bash
cp multivelas-sistema/.env.example multivelas-sistema/.env
```

Edit the `.env` file with your production values.

**Frontend (.env in multivelas-frontend/):**
```bash
cp multivelas-frontend/.env.example multivelas-frontend/.env
```

#### Step 4: Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

#### Step 5: Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **MongoDB:** localhost:27017

#### Step 6: Create Admin User
```bash
# Connect to backend container
docker-compose exec backend npm run crear-admin
```

---

### ☁️ Deployment to Render.com (Free Tier)

#### Step 1: Prepare MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0)
4. Create a database user
5. Whitelist all IP addresses (0.0.0.0/0)
6. Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/multivelas`)

#### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** multivelas-backend
   - **Root Directory:** multivelas-sistema
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_secure_random_string
   NODE_ENV=production
   PORT=4000
   ```
6. Click "Create Web Service"

#### Step 3: Deploy Frontend to Render

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name:** multivelas-frontend
   - **Root Directory:** multivelas-frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** dist
4. Add Environment Variable:
   ```
   VITE_API_URL=https://multivelas-backend.onrender.com
   ```
5. Click "Create Static Site"

#### Step 4: Update CORS

Update backend to allow frontend domain:
- In `multivelas-sistema/src/index.js`, update CORS configuration to include your Render frontend URL

---

### 🚀 Deployment to Railway.app

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Deploy Backend
```bash
cd multivelas-sistema
railway init
railway up

# Add environment variables
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_secret
railway variables set NODE_ENV=production
```

#### Step 3: Deploy Frontend
```bash
cd ../multivelas-frontend
railway init
railway up

# Add environment variable
railway variables set VITE_API_URL=your_backend_url
```

---

### 🖥️ Deployment to VPS (DigitalOcean/Linode)

#### Step 1: Create Droplet/VPS
- Choose Ubuntu 22.04 LTS
- Minimum 2GB RAM recommended
- Select datacenter region closest to your users

#### Step 2: Initial Server Setup
```bash
# SSH into your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

#### Step 3: Deploy Application
```bash
# Create application directory
mkdir -p /var/www/multivelas
cd /var/www/multivelas

# Clone repository
git clone https://github.com/derekCmorales/MULTIVELAS.git .

# Setup backend
cd multivelas-sistema
npm install --production
cp .env.example .env
nano .env  # Edit with your production values

# Setup frontend
cd ../multivelas-frontend
npm install
npm run build

# Start backend with PM2
cd ../multivelas-sistema
pm2 start src/index.js --name multivelas-backend
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/multivelas`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/multivelas/multivelas-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/multivelas /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 5: Setup SSL with Let's Encrypt
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

### ▲ Deploy Frontend to Vercel

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd multivelas-frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: multivelas-frontend
# - Directory: ./
# - Override settings? Yes
# - Build command: npm run build
# - Output directory: dist
```

#### Step 3: Add Environment Variable
```bash
vercel env add VITE_API_URL
# Enter your backend URL
```

#### Step 4: Deploy to Production
```bash
vercel --prod
```

---

## 🔒 Production Best Practices

### Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets (min 64 characters)
   - Rotate secrets regularly

2. **Database Security**
   - Enable MongoDB authentication
   - Use strong passwords
   - Whitelist only necessary IP addresses
   - Enable encryption at rest (MongoDB Atlas)

3. **HTTPS/SSL**
   - Always use HTTPS in production
   - Use Let's Encrypt for free SSL certificates
   - Configure HSTS headers

4. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Use express-rate-limit package

5. **Input Validation**
   - Already implemented with express-validator
   - Always validate and sanitize user input

### Performance

1. **Compression**
   - Enable gzip compression
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching**
   - Use Redis for session storage
   - Implement API response caching
   - Use CDN for static assets

3. **Database Optimization**
   - Create indexes for frequently queried fields
   - Use MongoDB aggregation pipelines
   - Monitor slow queries

4. **Frontend Optimization**
   - Code splitting (already enabled with Vite)
   - Lazy loading
   - Image optimization

### Monitoring

1. **Application Monitoring**
   - PM2 monitoring (for VPS)
   - Render/Railway built-in monitoring
   - Consider: New Relic, DataDog, or Sentry

2. **Logs**
   - Centralized logging (LogDNA, Papertrail)
   - Log rotation
   - Error tracking with Sentry

3. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

### Backup

1. **Database Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Self-hosted: Daily backups with mongodump
   ```bash
   mongodump --uri="mongodb://localhost:27017/multivelas" --out=/backups/$(date +%Y%m%d)
   ```

2. **Application Backups**
   - Git for code
   - Regular snapshots of VPS (if applicable)

### CI/CD

1. **GitHub Actions** (example workflow included)
2. **Automatic deployments** on push to main branch
3. **Automated testing** before deployment

---

## 📚 Additional Resources

### Documentation
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

### Tutorials
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Deploy Node.js to Render](https://render.com/docs/deploy-node-express-app)
- [Vercel Deployment](https://vercel.com/docs)

### Tools
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL certificates
- [PM2](https://pm2.keymetrics.io/) - Process manager
- [Nginx](https://nginx.org/) - Web server
- [Docker](https://www.docker.com/) - Containerization

---

## 🆘 Troubleshooting

### Common Issues

#### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check port 4000 is not in use
- Review logs: `docker-compose logs backend` or `pm2 logs`

#### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS configuration in backend
- Ensure backend is running
- Check browser console for errors

#### MongoDB connection errors
- Verify connection string
- Check network access (whitelist IPs in Atlas)
- Verify database user credentials
- Ensure MongoDB service is running

#### 502 Bad Gateway (Nginx)
- Check if backend is running
- Verify proxy_pass URL in Nginx config
- Check backend logs

---

## 💡 Recommendations for Enterprise Deployment

### For Small Business (Budget: $0-50/month)
- **Option:** Render.com + MongoDB Atlas
- **Frontend:** Render Static Site (Free)
- **Backend:** Render Web Service ($7/month)
- **Database:** MongoDB Atlas M2 ($9/month)
- **Total:** ~$16/month
- **Scales to:** 100-500 concurrent users

### For Medium Business (Budget: $100-300/month)
- **Option:** VPS + MongoDB Atlas
- **Infrastructure:** DigitalOcean Droplet 4GB ($24/month)
- **Database:** MongoDB Atlas M10 ($57/month)
- **CDN:** Cloudflare (Free)
- **Monitoring:** UptimeRobot (Free)
- **Total:** ~$81/month
- **Scales to:** 1,000-5,000 concurrent users

### For Large Enterprise (Budget: $500+/month)
- **Option:** AWS/GCP with managed services
- **Compute:** Auto-scaling EC2/Compute Engine
- **Database:** MongoDB Atlas M30+ or DocumentDB
- **CDN:** CloudFront/Cloud CDN
- **Load Balancer:** ALB/Load Balancer
- **Monitoring:** CloudWatch/Stackdriver
- **Total:** $500-2,000/month
- **Scales to:** 10,000+ concurrent users

---

## 📞 Support

For deployment issues:
1. Check this guide's troubleshooting section
2. Review application logs
3. Check MongoDB Atlas status
4. Consult platform-specific documentation

---

**Last Updated:** December 2024
**Version:** 1.0.0
