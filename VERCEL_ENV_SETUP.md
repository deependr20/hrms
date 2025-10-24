# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

## ❌ **Current Issue:**
Backend APIs returning 500 errors on Vercel deployment.

## 🔍 **Root Cause:**
Missing or incorrect environment variables in Vercel dashboard.

---

## ✅ **SOLUTION: Set These Environment Variables in Vercel**

### **Step 1: Go to Vercel Dashboard**
1. Open [vercel.com](https://vercel.com)
2. Go to your HRMS project
3. Click **Settings** → **Environment Variables**

### **Step 2: Add These EXACT Variables**

Copy and paste each variable exactly as shown:

```bash
# Database Connection
MONGODB_URI
mongodb+srv://hrms:satyam@satyam.gied0jg.mongodb.net/hrms_db?retryWrites=true&w=majority

# Authentication Secrets
NEXTAUTH_SECRET
wg5Q+WLKYbxH3IXjom+F4SnhUacmsJSdCxf4rsQsuNI=

JWT_SECRET
1mMMQ9J5DghFUW2e5YKA+/eD0jxmlHSI9GJiVRAUUZw=

# App URLs (Update with your actual Vercel URL)
NEXTAUTH_URL
https://hrms-x5bp.vercel.app

NEXT_PUBLIC_APP_URL
https://hrms-x5bp.vercel.app

# App Configuration
NEXT_PUBLIC_APP_NAME
HRMS System

# File Upload Settings
MAX_FILE_SIZE
5242880

UPLOAD_DIR
./public/uploads

# Environment
NODE_ENV
production
```

### **Step 3: Update URLs After Deployment**

**IMPORTANT**: Replace `https://hrms-x5bp.vercel.app` with your actual Vercel URL:

1. **Find your Vercel URL** (e.g., `https://your-app-name.vercel.app`)
2. **Update these variables**:
   - `NEXTAUTH_URL` → Your actual Vercel URL
   - `NEXT_PUBLIC_APP_URL` → Your actual Vercel URL

---

## 🧪 **Test API After Setting Variables**

After setting environment variables:

1. **Redeploy** your application
2. **Test API** by visiting: `https://your-vercel-url.vercel.app/api/test`
3. **Check login** at: `https://your-vercel-url.vercel.app/login`

---

## 🔑 **Login Credentials**

```
👤 Admin: admin@hrms.com / admin123
👤 HR: hr@hrms.com / hr123
👤 Manager: manager@hrms.com / manager123
👤 Employee: employee@hrms.com / employee123
```

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still getting 500 errors**
- **Solution**: Check Vercel function logs for detailed error messages
- **Check**: All environment variables are set correctly

### **Issue 2: Database connection fails**
- **Solution**: Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- **Check**: MongoDB URI is exactly as provided above

### **Issue 3: Authentication not working**
- **Solution**: Ensure `NEXTAUTH_URL` matches your exact Vercel URL
- **Check**: No trailing slashes in URLs

---

## 📋 **Verification Checklist**

- [ ] All 9 environment variables set in Vercel
- [ ] MongoDB URI exactly matches the provided string
- [ ] NEXTAUTH_URL and NEXT_PUBLIC_APP_URL match your Vercel URL
- [ ] Application redeployed after setting variables
- [ ] API test endpoint returns success
- [ ] Login page works without 500 errors

**After completing these steps, your HRMS should work perfectly on Vercel!** 🎉
