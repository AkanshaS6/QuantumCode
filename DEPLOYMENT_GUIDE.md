# 🚀 QUANTUMCODE - COMPLETE DEPLOYMENT GUIDE
## Deploy Frontend to Vercel & Backend to Render

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before deploying, complete these steps:

### Step 1: Update Your .env File with API Key
Your Judge0 API key is no longer hardcoded (✅ FIXED). 
Add it to BackEnd/.env:

```bash
# In BackEnd/.env - Replace with your actual Judge0 API key
JUDGE0_API_KEY=your-actual-judge0-api-key
```

### Step 2: Rotate Your Credentials (SECURITY)
⚠️ **Your real credentials are in the .env file and in GitHub history. You MUST rotate them:**

- **MongoDB**: Create new user at MongoDB Atlas
- **Redis**: Create new token at Redis Labs  
- **Judge0**: Get new API key
- **JWT_KEY**: Generate new: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 3: Update Frontend Environment Variable
Create `FrontEnd/.env.local` (for development):

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Later, Vercel will override this with production value.

### Step 4: Verify Git Setup
Ensure .env files are NOT tracked:

```bash
cd QuantumCode
git status
# Should show: Backend/.env and FrontEnd/.env.local are untracked or ignored
```

---

## 📋 STEP-BY-STEP DEPLOYMENT PROCESS

### **PHASE 1: BACKEND DEPLOYMENT TO RENDER**

#### 1.1 Remove Old Credentials from Git History (CRITICAL)
```bash
# Windows PowerShell
cd QuantumCode

# Check if .env is currently tracked
git ls-files | findstr ".env"

# If it shows BackEnd\.env is tracked, remove it:
git rm --cached BackEnd/.env
git commit -m "Remove sensitive .env file from git history"
git push
```

#### 1.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Connect your GitHub

#### 1.3 Create Backend Service on Render
1. Click **"New +"** → **"Web Service"**
2. Find your **QuantumCode** repository and click **"Connect"**

#### 1.4 Configure Render Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `quantumcode-backend` |
| **Environment** | `Node` |
| **Build Command** | `cd BackEnd && npm install` |
| **Start Command** | `cd BackEnd && npm start` |
| **Instance Type** | `Free` (for testing) |

**IMPORTANT**: The `cd BackEnd` is crucial - it tells Render where your backend code is!

#### 1.5 Add Environment Variables to Render
Click **"Advanced"** → **"Add Environment Variable"** for each:

```
PORT = 3000
NODE_ENV = production
DB_CONNECT_STRING = mongodb+srv://your-username:password@cluster.mongodb.net/quantumcode?retryWrites=true&w=majority
JWT_KEY = (use new generated key - not the old one!)
JUDGE0_API_KEY = (your Judge0 API key)
REDIS_HOST = redis-xxxxx.c266.us-east-1-3.ec2.cloud.redislabs.com
REDIS_PORT = 17078
REDIS_PASS = (your Redis password)
FRONTEND_URL = (leave empty for now, will update after deploying frontend)
```

#### 1.6 Deploy Backend
Click **"Create Web Service"** and wait 2-5 minutes for deployment.

✅ When done, you'll see your backend URL like:
```
https://quantumcode-backend-xxxxx.onrender.com
```

**COPY THIS URL** - You need it for frontend!

---

### **PHASE 2: FRONTEND DEPLOYMENT TO VERCEL**

#### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Connect your GitHub

#### 2.2 Import Project to Vercel
1. Click **"Add New"** → **"Project"**
2. Select your **QuantumCode** repository
3. Click **"Import"**

#### 2.3 Configure Frontend Settings
1. **Framework Preset**: Select `Vite`
2. **Build Command**: Should auto-detect `vite build` ✓
3. **Output Directory**: Should auto-detect `dist` ✓
4. **Install Command**: Should auto-detect `npm install` ✓

**Project Root**: Make sure it says `./` (root of repository)

For **Build and Output Settings**, set:
- **Framework**: `Vite`
- **Build Command**: `cd FrontEnd && npm install && npm run build`
- **Output Directory**: `FrontEnd/dist`

#### 2.4 Add Environment Variables to Vercel
Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL = https://quantumcode-backend-xxxxx.onrender.com
```

(Replace with your actual Render backend URL from Step 1.6)

#### 2.5 Deploy Frontend
Click **"Deploy"** and wait 2-3 minutes.

✅ When done, you'll see your frontend URL like:
```
https://quantumcode-xxxxx.vercel.app
```

**COPY THIS URL** - You need it for backend!

---

### **PHASE 3: UPDATE BACKEND WITH FRONTEND URL**

#### 3.1 Update Render Environment Variables
1. Go to https://render.com/dashboard
2. Click on your **quantumcode-backend** service
3. Click **"Environment"**
4. Find `FRONTEND_URL` variable
5. Change it to your Vercel URL:
```
FRONTEND_URL = https://quantumcode-xxxxx.vercel.app
```

6. Click **"Save"** - Service will **auto-redeploy** (watch the "Deploys" tab)

#### 3.2 Wait for Redeployment
Backend will redeploy automatically with new CORS configuration. Wait 1-2 minutes.

---

## 🧪 TESTING YOUR DEPLOYMENT

#### Check 1: Backend is Running
Open in browser:
```
https://quantumcode-backend-xxxxx.onrender.com/
```
You should see (or it redirects):
- Server is running message, or
- 404 error (which is OK - means server is up)

#### Check 2: Frontend Loads
Open in browser:
```
https://quantumcode-xxxxx.vercel.app/
```
Should load the LandingPage with no console errors.

#### Check 3: Authentication Works
1. Click Sign Up
2. Register a new user
3. Should succeed and redirect to problems page

#### Check 4: Problems Load
On problems page, should see list of problems from database.
Check browser console (F12) for any API errors.

#### Check 4: Contest Works
1. Create contest room
2. Should connect to backend via WebSocket
3. No CORS errors in console

#### Check 5: Check Logs for Errors

**Backend Logs** (Render):
- Go to Render dashboard → Backend service → "Logs" tab
- Look for errors (red text)

**Frontend Logs** (Vercel):
- Go to Vercel dashboard → Frontend project → "Deployments" → Click latest → "Build Logs"

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Fix**:
1. Check that `FRONTEND_URL` is set in Render
2. Make sure it matches your Vercel URL exactly (with `https://`, no trailing slash)
3. Go to Render dashboard → Redeploy manually if needed

### Issue: WebSocket Connection Failed
**Error**: `WebSocket handshake failed` or socket doesn't connect

**Fix**:
1. Check backend is running (visit https://your-backend-url.onrender.com)
2. Verify `FRONTEND_URL` is correct in Render
3. Check browser console for actual error message

### Issue: Database Connection Failed
**Error**: `MongoError: connect ECONNREFUSED` or timeout

**Fix**:
1. Check `DB_CONNECT_STRING` is correct in Render env variables
2. Add your Render IP to MongoDB whitelist:
   - Go to MongoDB Atlas → Network Access
   - Add IP range `0.0.0.0/0` (allows all - less secure but works)
   - OR add Render's NAT IP specifically

### Issue: Judge0 Not Working
**Error**: `JUDGE0_API_KEY not set` or `API request failed`

**Fix**:
1. Check `JUDGE0_API_KEY` is set in Render env
2. Go to https://judge0.com and verify API key is valid
3. Check API rate limits not exceeded

### Issue: Frontend Shows Blank Page
**Error**: Nothing loads, white screen

**Fix**:
1. Check Vercel build logs for errors
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Check browser console (F12) for errors

### Issue: Redirect Loop or 404s
**Error**: Keep getting redirected or 404 on pages

**Fix**:
1. Vercel needs config for SPA routing
2. Create `FrontEnd/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

3. Push to GitHub and redeploy on Vercel

---

## 📦 GETTING EXTERNAL SERVICES (Free Tier)

### MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 free cluster
4. Create Database User (username + password)
5. Whitelist IP: 0.0.0.0/0
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Redis Labs (Token Caching - Optional)
1. Go to https://redis.com/try-free/
2. Create free database (under 30 MB)
3. Get configuration details (host, port, password)

### Judge0 API (Code Execution)
1. Go to https://judge0.com/
2. Get free API key
3. Free tier includes thousands of code submissions

---

## 🔒 SECURITY NOTES

✅ **What You Fixed**:
- Judge0 API key moved from hardcoded to environment variable

⚠️ **Still TODO**:
- Rotate all credentials (they were exposed in .env file)
- Remove old .env commits from Git history (can't be fully removed, but rotate credentials)
- Add rate limiting to API
- Hide test case answers in responses
- Implement activity logging

⚠️ **For Production**:
- Never commit .env files
- Use Render's environment variable management (✅ You are)
- Use Vercel's environment variable management (✅ You are)
- Rotate credentials regularly
- Enable HTTPS (already enabled on Render/Vercel) ✅
- Implement authentication best practices

---

## ✅ DEPLOYMENT COMPLETE!

After all steps, you're live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com

Share your frontend URL - it's your live application!

---

## 📞 NEXT STEPS

1. Test the application thoroughly
2. Set up custom domain (optional)
3. Monitor performance in Render & Vercel dashboards
4. Set up email notifications for deployment failures
5. Plan backup strategy for MongoDB

Good luck! 🎉
