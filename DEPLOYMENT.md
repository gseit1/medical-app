# Production Deployment Guide

## Overview
This guide covers deploying the Clinical Medical App to production using:
- **Frontend**: Netlify (https://clinical.netlify.app)
- **Backend**: Render (https://your-app.onrender.com)
- **Database**: MongoDB Atlas (Already configured)

## Prerequisites
✅ MongoDB Atlas database set up and seeded
✅ GitHub repository with latest code
✅ Netlify account
✅ Render account

## 1. Backend Deployment (Render)

### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `gseit1/medical-app`
4. Select the `backend` directory as root directory

### Step 2: Configure Build Settings
```
Name: clinical-medical-backend
Environment: Node
Region: Your preferred region
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://admin:Ayra1357@cluster0.5u65it4.mongodb.net/medical_app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-production-jwt-secret-key-generate-new-one
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL: `https://clinical-medical-backend.onrender.com`

## 2. Frontend Deployment (Netlify)

### Step 1: Update Environment Variables
1. Update `frontend/.env.production` with your Render backend URL:
```
VITE_BACKEND_URL=https://clinical-medical-backend.onrender.com
```

### Step 2: Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Configure build settings:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### Step 3: Configure Environment Variables
In Netlify dashboard, go to Site settings → Environment variables:
```
VITE_BACKEND_URL=https://clinical-medical-backend.onrender.com
VITE_NODE_ENV=production
```

### Step 4: Set Custom Domain (Optional)
- In Netlify dashboard, go to Domain settings
- Add custom domain: `clinical.netlify.app` or your preferred domain
- Netlify will automatically provision SSL certificates

## 3. Update CORS Configuration

### After getting your Netlify URL:
1. Update the backend CORS configuration in `server.js`
2. Replace `YOUR_NETLIFY_SITE_NAME` with your actual Netlify site name
3. Redeploy the backend service

## 4. Testing Production Deployment

### Health Check
Test backend health: `https://your-backend.onrender.com/health`

### API Endpoints
- Login: `https://your-backend.onrender.com/api/auth/login`
- Patients: `https://your-backend.onrender.com/api/patients/with-instructions`
- Safety Verification: `https://your-backend.onrender.com/api/instructions/verify-safety`

### Frontend Access
- Main app: `https://clinical.netlify.app`
- Barcode scanning: `https://clinical.netlify.app/safety` (HTTPS enables camera access)

## 5. Security Considerations

### Environment Variables
- ✅ MongoDB connection string secured
- ✅ JWT secret is production-ready
- ✅ CORS configured for production domains only

### HTTPS Requirements
- ✅ Netlify provides automatic HTTPS
- ✅ Render provides automatic HTTPS
- ✅ Camera access requires HTTPS (now enabled)

## 6. Monitoring and Maintenance

### Database
- Monitor MongoDB Atlas usage in Atlas dashboard
- Set up alerts for connection issues

### Backend (Render)
- Monitor service health at `/health` endpoint
- Check logs in Render dashboard
- Set up uptime monitoring

### Frontend (Netlify)
- Monitor build deployments
- Check function logs if using Netlify functions

## 7. Troubleshooting

### Common Issues
1. **CORS Errors**: Update allowed origins in backend
2. **API Connection Failed**: Check environment variables
3. **Database Connection**: Verify MongoDB URI and network access
4. **Camera Not Working**: Ensure HTTPS is enabled

### Support Commands
```bash
# Test backend locally with production DB
npm run start

# Check MongoDB connection
node seed_mongo.js

# Build frontend for production
npm run build
```

## 8. Post-Deployment Checklist

- [ ] Backend health check responds successfully
- [ ] Frontend loads and connects to backend
- [ ] User authentication works
- [ ] Patient data loads correctly
- [ ] Barcode scanning works with camera (HTTPS)
- [ ] Safety verification workflow functions
- [ ] Mobile responsiveness verified
- [ ] SSL certificates active on both domains

## Next Steps

1. **Custom Domain**: Set up your preferred domain
2. **Monitoring**: Implement uptime monitoring
3. **Backup Strategy**: Configure MongoDB Atlas backups
4. **CI/CD**: Set up automated deployments from GitHub
5. **Performance**: Monitor and optimize API response times