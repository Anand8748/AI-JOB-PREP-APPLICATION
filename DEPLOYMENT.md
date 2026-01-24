# 🚀 Deployment Guide

This guide will help you deploy the AI Job Interview application with frontend on Vercel and backend on Render using OpenAI API.

## 📋 Prerequisites

- GitHub repository with your code
- Vercel account (free)
- Render account (free tier)
- MongoDB Atlas account (free tier)
- OpenAI API key

## 🎯 Frontend Deployment (Vercel)

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `ai-job-interview`
4. Select the `frontend` directory as the root directory

### 2. Configure Vercel Settings

**Build Settings:**
- Framework Preset: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3. Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your Vercel URL (e.g., `https://ai-job-interview.vercel.app`)

## 🖥️ Backend Deployment (Render)

### 1. Connect to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Set the root directory to `backend`

### 2. Configure Render Settings

**Basic Settings:**
- Name: `ai-job-interview-backend`
- Region: Choose nearest region
- Branch: `main`
- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
```

### 3. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your Render URL (e.g., `https://ai-job-interview-backend.onrender.com`)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (free M0 tier)

### 2. Configure Database

1. Create a database user with username and password
2. Add your IP address to whitelist (or use 0.0.0.0/0 for all IPs)
3. Get your connection string from "Connect" → "Connect your application"

### 3. Update Environment Variables

Use the connection string in your Render environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-interview?retryWrites=true&w=majority
```

## 🤖 OpenAI API Setup

### 1. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key for use in environment variables

### 2. Update Environment Variables

**Backend (Render):**
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 🔄 Final Configuration Updates

### 1. Update Frontend Environment

Go to your Vercel project settings and add:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 2. Update Backend Environment

Go to your Render service settings and add:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 3. Redeploy Both Services

1. Trigger a new deployment on Vercel
2. Trigger a new deployment on Render

## ✅ Testing Your Deployment

1. Visit your frontend URL
2. Upload a resume
3. Start an interview session
4. Check browser console for any errors

## 🐛 Common Issues & Solutions

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that the backend allows requests from your frontend domain

### API Connection Issues
- Verify `VITE_API_URL` in frontend points to your Render URL
- Ensure both services are running and accessible

### Database Connection Issues
- Check MongoDB connection string format
- Verify IP whitelist includes Render's IP ranges
- Ensure database user has proper permissions

### OpenAI API Issues
- Verify OpenAI API key is correctly set
- Check API key has sufficient credits
- Ensure OpenAI API is accessible from Render's servers

## 📊 Monitoring

### Vercel
- Check deployment logs in Vercel dashboard
- Monitor function usage and performance

### Render
- View service logs in Render dashboard
- Monitor resource usage and response times

### MongoDB Atlas
- Monitor database performance in Atlas dashboard
- Check connection logs for any issues

## 🔄 CI/CD

Both Vercel and Render automatically deploy when you push to your main branch, making updates seamless!

---

**Need help?** Check the logs in both Vercel and Render dashboards for detailed error information.
