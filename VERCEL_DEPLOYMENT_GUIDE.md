# 🚀 VERCEL DEPLOYMENT GUIDE - HRMS SYSTEM

## 📋 **Pre-Deployment Checklist**

### ✅ **1. Database Setup (MongoDB Atlas)**
Before deploying to Vercel, you need a cloud database since Vercel is serverless.

**Steps to set up MongoDB Atlas:**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**
   - Click "Create a Cluster"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `hrms_admin` (or your choice)
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hrms_db`

**Your connection string will look like:**
```
mongodb+srv://hrms_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hrms_db?retryWrites=true&w=majority
```

---

## 🔧 **Environment Variables for Vercel**

### **Required Environment Variables:**

When you deploy to Vercel, you need to set these environment variables in the Vercel dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://hrms_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hrms_db?retryWrites=true&w=majority

# Authentication & Security
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-a-super-secure-random-string-here
JWT_SECRET=generate-another-super-secure-random-string-here

# App Configuration
NEXT_PUBLIC_APP_NAME=HRMS System
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads

# Production Settings
NODE_ENV=production
```

### **🔐 How to Generate Secure Secrets:**

**For NEXTAUTH_SECRET and JWT_SECRET, use one of these methods:**

**Method 1: Online Generator**
- Go to [Generate Random](https://generate-random.org/api-key-generator)
- Generate a 64-character random string
- Use different strings for NEXTAUTH_SECRET and JWT_SECRET

**Method 2: Command Line**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

**Method 3: Node.js**
```javascript
// Run this in Node.js console
require('crypto').randomBytes(32).toString('base64')
```

---

## 🚀 **Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Create vercel.json** (Optional - for custom configuration)
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "functions": {
       "app/api/**/*.js": {
         "maxDuration": 30
       }
     }
   }
   ```

### **Step 2: Deploy to Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your HRMS repository from GitHub
   - Click "Import"

3. **Configure Project**
   - **Project Name:** `hrms-system` (or your choice)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables**
   - In the "Environment Variables" section, add all the variables listed above
   - **IMPORTANT:** Replace placeholder values with your actual values:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NEXTAUTH_URL`: Your Vercel app URL (e.g., `https://hrms-system.vercel.app`)
     - `NEXT_PUBLIC_APP_URL`: Same as NEXTAUTH_URL
     - `NEXTAUTH_SECRET`: Your generated secure secret
     - `JWT_SECRET`: Your generated secure secret

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-3 minutes)

### **Step 3: Post-Deployment Setup**

1. **Update Environment Variables**
   - After deployment, go to your Vercel project dashboard
   - Go to "Settings" → "Environment Variables"
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your actual Vercel URL

2. **Test Your Application**
   - Visit your deployed URL
   - Test login functionality
   - Verify all features work correctly

---

## 🔧 **Environment Variables Reference**

### **Copy these to your Vercel Environment Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |
| `NEXTAUTH_SECRET` | `your-secure-secret` | NextAuth encryption secret |
| `JWT_SECRET` | `your-jwt-secret` | JWT token signing secret |
| `NEXT_PUBLIC_APP_NAME` | `HRMS System` | Application name |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Public app URL |
| `MAX_FILE_SIZE` | `5242880` | Max file upload size (5MB) |
| `UPLOAD_DIR` | `./public/uploads` | Upload directory |
| `NODE_ENV` | `production` | Environment mode |

---

## 🎯 **Default Login Credentials**

After deployment, you can login with these default accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@hrms.com | admin123 |
| **HR** | hr@hrms.com | hr123 |
| **Manager** | manager@hrms.com | manager123 |
| **Employee** | employee@hrms.com | employee123 |

**⚠️ IMPORTANT:** Change these default passwords after first login in production!

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Database Connection Error**
   - Verify MongoDB Atlas connection string
   - Check if IP address is whitelisted (0.0.0.0/0)
   - Ensure database user has correct permissions

2. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your Vercel URL
   - Check NEXTAUTH_SECRET is set correctly
   - Ensure JWT_SECRET is configured

3. **Build Failures**
   - Check if all dependencies are in package.json
   - Verify environment variables are set
   - Review build logs in Vercel dashboard

4. **API Routes Not Working**
   - Ensure all API routes are in app/api/ directory
   - Check if middleware is configured correctly
   - Verify JWT_SECRET is available to API routes

---

## 🚀 **Production Optimizations**

### **Performance Improvements:**

1. **Enable Vercel Analytics**
   - Go to your project dashboard
   - Enable "Analytics" in settings
   - Monitor performance metrics

2. **Configure Caching**
   - API responses are automatically cached by Vercel
   - Static assets are served from CDN

3. **Monitor Usage**
   - Check Vercel dashboard for usage metrics
   - Monitor function execution times
   - Track bandwidth usage

---

## 🎉 **Deployment Complete!**

Once deployed, your HRMS system will be available at:
**`https://your-app-name.vercel.app`**

### **Features Available:**
✅ **Complete HRMS Functionality**
✅ **Performance Management System**
✅ **Role-Based Access Control**
✅ **Real-time Data Synchronization**
✅ **Responsive Design**
✅ **Production-Ready Security**

**Your HRMS is now live and ready for production use!** 🎊

---

## 📞 **Need Help?**

If you encounter any issues during deployment:

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - Review error logs

2. **Verify Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

3. **Test Locally First**
   - Run `npm run build` locally
   - Fix any build errors before deploying

**Happy Deploying! 🚀**
