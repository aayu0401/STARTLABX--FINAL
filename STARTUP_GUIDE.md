# 🚀 STARTLABX - Quick Start Guide

We have successfully fixed the build issues! Follow these steps to run the application.

## 1. Start the Backend (in a separate terminal)
The backend handles authentication and database connections.

```powershell
cd backend-api
npm run dev
```
*Expected output: `Server running on port 8080`*

## 2. Start the Frontend (Production Mode)
We recommend running the production build we just created, as it is faster and bug-free.

```powershell
npm start
```
*Expected output: `Ready in ...`*
*Open your browser to: **http://localhost:3000** (or 3001/3002 depending on availability)*

## 3. Alternative: Development Mode
If you want to edit code, you can run dev mode (the SSR fix applies here too).

```powershell
export NODE_ENV=development
npm run dev
```

---

## 🔑 Login Credentials (Demo)

| Role | Email | Password |
|------|-------|----------|
| **Professional** | john@example.com | password123 |
| **Startup** | mike@example.com | password123 |

## ✅ Verification
- Go to `http://localhost:3000`
- Click **Login**
- You should see the Dashboard WITHOUT any "localStorage" errors!
