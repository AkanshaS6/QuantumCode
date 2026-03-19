# 🎯 QUANTUMCODE DEPLOYMENT CHECKLIST

## BEFORE YOU START
- [ ] You have GitHub account with QuantumCode repo
- [ ] You have MongoDB Atlas account (free tier OK)
- [ ] You have Redis account (optional but recommended)
- [ ] You have Judge0 API key
- [ ] Backend .env file has all credentials filled in locally
- [ ] You understand the 3 phases: Backend → Frontend → Update Backend URL

---

## PHASE 1: BACKEND DEPLOYMENT (Render)

### Preparation
- [ ] Read BackEnd/.env.example to understand variables
- [ ] Fill in BackEnd/.env with actual credentials
- [ ] Fix judge0.js to use environment variable (✅ DONE)
- [ ] Commit and push changes to GitHub

### Render Setup
- [ ] Create Render account (https://render.com)
- [ ] Connect GitHub account to Render
- [ ] Create new Web Service
- [ ] Set Name: `quantumcode-backend`
- [ ] Set Build Command: `cd BackEnd && npm install`
- [ ] Set Start Command: `cd BackEnd && npm start`
- [ ] Add all environment variables:
  - [ ] PORT = 3000
  - [ ] NODE_ENV = production
  - [ ] DB_CONNECT_STRING = [MongoDB connection string]
  - [ ] JWT_KEY = [Your secure JWT key]
  - [ ] JUDGE0_API_KEY = [Your Judge0 key]
  - [ ] REDIS_HOST = [Your Redis host]
  - [ ] REDIS_PORT = [Your Redis port]
  - [ ] REDIS_PASS = [Your Redis password]
  - [ ] FRONTEND_URL = [Leave blank for now]

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 2-5 minutes for deployment
- [ ] See "Deploy successful"
- [ ] Copy backend URL: `https://quantumcode-backend-xxxxx.onrender.com`
- [ ] Test backend URL in browser (should load without errors)

---

## PHASE 2: FRONTEND DEPLOYMENT (Vercel)

### Preparation
- [ ] Create FrontEnd/.env.local with:
  - `VITE_API_BASE_URL=http://localhost:3000`
- [ ] Read FrontEnd/.env.example
- [ ] Push latest code to GitHub

### Vercel Setup
- [ ] Create Vercel account (https://vercel.com)
- [ ] Connect GitHub account to Vercel
- [ ] Import your QuantumCode repository
- [ ] Framework Preset: Select `Vite`
- [ ] Build Command: `cd FrontEnd && npm install && npm run build`
- [ ] Output Directory: `FrontEnd/dist`
- [ ] Add Environment Variable:
  - [ ] VITE_API_BASE_URL = [Your Render backend URL from Phase 1]

### Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes for deployment
- [ ] See "Deploy successful"
- [ ] Copy frontend URL: `https://quantumcode-xxxxx.vercel.app`
- [ ] Test frontend URL in browser

---

## PHASE 3: UPDATE BACKEND WITH FRONTEND URL

### Update Render Environment
- [ ] Go to Render dashboard
- [ ] Open `quantumcode-backend` service
- [ ] Click "Environment"
- [ ] Find `FRONTEND_URL` variable
- [ ] Update value to: [Your Vercel frontend URL]
- [ ] Save changes
- [ ] Watch Render redeploy (1-2 minutes)
- [ ] See deployment complete

---

## TESTING

### Test Backend
- [ ] Open https://quantumcode-backend-xxxxx.onrender.com in browser
- [ ] Check Render logs for errors
- [ ] Should see server is running

### Test Frontend
- [ ] Open https://quantumcode-xxxxx.vercel.app in browser
- [ ] Should load without errors
- [ ] Check browser console (F12) - no CORS or API errors
- [ ] Check Vercel build logs - no errors

### Test Features
- [ ] Sign up new user (tests: auth + database)
- [ ] Login (tests: JWT)
- [ ] View problems (tests: database queries)
- [ ] Create contest room (tests: WebSocket connection)
- [ ] Run code (tests: Judge0 integration)

### Check for CORS Issues
- [ ] Open browser F12 → Console
- [ ] Create contest room
- [ ] Should NOT see CORS errors
- [ ] If CORS error appears:
  - [ ] Check FRONTEND_URL is in Render env
  - [ ] Check URL matches exactly (with https://)
  - [ ] Trigger Render redeploy

---

## SECURITY CHECKLIST

- [ ] ✅ Judge0 API key moved from hardcoded to .env
- [ ]⚠️ **TODO**: Rotate credentials (they were exposed in repo)
  - [ ] Create new MongoDB user
  - [ ] Create new Redis token
  - [ ] Generate new Judge0 API key
  - [ ] Generate new JWT key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] ✅ .env files are in .gitignore
- [ ] ✅ Using Render/Vercel environment variables for secrets
- [ ] ⚠️ Consider: Remove old .env from Git history (git-filter-branch)
- [ ] ⚠️ Consider: Add rate limiting to API
- [ ] ⚠️ Consider: Hide test case answers from responses

---

## FINAL VERIFICATION

- [ ] Frontend loads without errors: https://quantumcode-xxxxx.vercel.app
- [ ] Backend is responsive: https://quantumcode-backend-xxxxx.onrender.com
- [ ] User can sign up and login
- [ ] Problems load from database
- [ ] Contest room creation works
- [ ] WebSocket connection established (no console errors)
- [ ] Code execution works via Judge0
- [ ] No CORS errors in console

---

## DEPLOYMENT COMPLETE! 🎉

Share your frontend URL with users:
```
https://quantumcode-xxxxx.vercel.app
```

---

## TROUBLESHOOTING QUICK REFERENCE

| Problem | Check These |
|---------|-------------|
| CORS Error | FRONTEND_URL in Render env, URL matches exactly |
| WebSocket doesn't connect | Backend running, FRONTEND_URL set, check Socket.io logs |
| Database can't connect | DB_CONNECT_STRING correct, IP whitelisted in MongoDB |
| Judge0 not working | API key valid, not rate-limited |
| Frontend blank page | Check Vercel build logs, clear browser cache |
| 404 on page refresh | Need vercel.json with rewrites in FrontEnd folder |

---

Created: March 19, 2026
Updated: [Current deployment date]
