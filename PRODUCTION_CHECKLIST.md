# 🚀 Production Deployment Checklist

Use this checklist to ensure a smooth production deployment.

## Pre-Deployment

### 🔐 Security
- [ ] Generate strong JWT secret (64+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Change default MongoDB credentials
- [ ] Review CORS settings (restrict to your domain)
- [ ] Enable HTTPS/SSL certificates
- [ ] Review and set secure environment variables
- [ ] Disable debug/development features
- [ ] Remove console.log statements from production code
- [ ] Enable rate limiting
- [ ] Configure MongoDB IP whitelist

### 📊 Database
- [ ] Create MongoDB Atlas account or setup MongoDB server
- [ ] Create database and user with proper permissions
- [ ] Configure connection string with credentials
- [ ] Enable MongoDB authentication
- [ ] Set up automated backups
- [ ] Create indexes for frequently queried fields
- [ ] Test database connection

### 🌐 Infrastructure
- [ ] Choose deployment platform (Render, Railway, VPS, etc.)
- [ ] Register domain name (if needed)
- [ ] Configure DNS settings
- [ ] Plan resource requirements (CPU, RAM, storage)
- [ ] Set up monitoring (UptimeRobot, New Relic, etc.)
- [ ] Configure error tracking (Sentry, etc.)

### ⚙️ Configuration
- [ ] Create production `.env` files (never commit!)
- [ ] Set NODE_ENV=production
- [ ] Configure backend URL in frontend
- [ ] Set up CDN for static assets (optional)
- [ ] Configure file upload storage
- [ ] Set appropriate timezone

## Deployment Steps

### Backend Deployment
- [ ] Push code to GitHub
- [ ] Configure backend service on platform
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Verify backend API is accessible
- [ ] Create admin user
- [ ] Test critical API endpoints

### Frontend Deployment
- [ ] Configure frontend service on platform
- [ ] Set VITE_API_URL to backend URL
- [ ] Build frontend locally to test
- [ ] Deploy frontend
- [ ] Verify frontend loads correctly
- [ ] Test frontend-backend connection

### Final Checks
- [ ] Test user registration/login
- [ ] Test product creation and management
- [ ] Test sales workflow
- [ ] Test employee management
- [ ] Test financial operations
- [ ] Verify data persistence
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Check application performance
- [ ] Verify all images and assets load

## Post-Deployment

### 🔍 Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up error alerts
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor server resources

### 💾 Backup & Recovery
- [ ] Verify automated backups are working
- [ ] Test backup restoration process
- [ ] Document recovery procedures
- [ ] Set up backup notifications

### 📈 Optimization
- [ ] Enable caching where appropriate
- [ ] Optimize database queries
- [ ] Minimize bundle size
- [ ] Enable compression
- [ ] Configure CDN (if using)
- [ ] Review and optimize images

### 📚 Documentation
- [ ] Document production architecture
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

### 🔄 Maintenance Plan
- [ ] Schedule regular updates
- [ ] Plan for security patches
- [ ] Set up dependency update alerts
- [ ] Schedule database maintenance
- [ ] Plan capacity scaling strategy

## Common Issues & Solutions

### Backend won't start
```bash
# Check logs
docker-compose logs backend
# OR
pm2 logs multivelas-backend

# Common issues:
# - MongoDB connection string incorrect
# - Missing environment variables
# - Port already in use
# - Dependencies not installed
```

### Frontend can't connect to backend
```bash
# Check VITE_API_URL in frontend .env
# Verify CORS settings in backend
# Check network tab in browser DevTools
# Ensure backend is running and accessible
```

### Database connection errors
```bash
# Verify MongoDB is running
# Check connection string format
# Verify network access (IP whitelist)
# Check credentials
# Review MongoDB logs
```

## Environment Variables Checklist

### Backend Required Variables
- [ ] `PORT` - Server port (default: 4000)
- [ ] `NODE_ENV` - Environment (production)
- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - Secret for JWT tokens

### Frontend Required Variables
- [ ] `VITE_API_URL` - Backend API URL

### Docker Compose Variables (if using Docker)
- [ ] `MONGO_ROOT_USERNAME` - MongoDB admin username
- [ ] `MONGO_ROOT_PASSWORD` - MongoDB admin password
- [ ] `JWT_SECRET` - Same as backend
- [ ] `VITE_API_URL` - Backend URL

## Performance Benchmarks

Track these metrics:
- [ ] Page load time: < 3 seconds
- [ ] API response time: < 500ms
- [ ] Time to interactive: < 5 seconds
- [ ] Database query time: < 100ms
- [ ] Concurrent users supported: Document baseline

## Security Audit

- [ ] Run npm audit on backend
- [ ] Run npm audit on frontend
- [ ] Review dependencies for vulnerabilities
- [ ] Test authentication flow
- [ ] Test authorization (role-based access)
- [ ] Verify input validation
- [ ] Check for XSS vulnerabilities
- [ ] Check for SQL/NoSQL injection vulnerabilities
- [ ] Review CORS configuration
- [ ] Test rate limiting

## Rollback Plan

If deployment fails:
1. [ ] Keep previous version accessible
2. [ ] Document rollback steps
3. [ ] Test rollback procedure
4. [ ] Communicate with users
5. [ ] Investigate and fix issues
6. [ ] Redeploy when ready

## Success Criteria

Deployment is successful when:
- [ ] All services are running
- [ ] Frontend loads without errors
- [ ] Users can log in
- [ ] All CRUD operations work
- [ ] No console errors
- [ ] No 500 errors in logs
- [ ] Health checks pass
- [ ] Monitoring is active

## Contact & Support

- Technical Lead: _________________
- DevOps Contact: _________________
- Emergency Hotline: _________________
- Escalation Path: _________________

---

**Last Updated:** December 2024

**Note:** This checklist should be reviewed and updated regularly based on your deployment experience.
