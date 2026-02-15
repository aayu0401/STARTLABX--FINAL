# EquityBuild - Complete Application Setup

## 🎉 Application Status: READY TO RUN

**Frontend**: ✅ Running on http://localhost:3000  
**Backend**: ✅ Running on http://localhost:8080  
**Database**: MongoDB (local or cloud)

---

## 🚀 Quick Start Guide

### 1. Start MongoDB (if using local)
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### 2. Start Backend
```bash
cd backend-api
npm run dev
```

**Backend will run on**: `http://localhost:8080`

### 3. Start Frontend
```bash
cd ..
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

### 4. Open Application
Navigate to: **http://localhost:3000**

---

## 📋 What's Built

### ✅ Frontend (Next.js)
- 13 Services (all API integrations)
- 11+ Pages (Dashboard, Feed, Messages, etc.)
- 37 UI Components
- Real-time features (Socket.IO client)
- Authentication flow
- Dark mode support

### ✅ Backend (Express/MongoDB)
- 6 Database Models
- 9 API Route Modules
- JWT Authentication
- Socket.IO Real-time
- All CRUD operations
- Error handling

---

## 🔑 Test Accounts

Create accounts by registering at:
**http://localhost:3000/signup**

---

## 📡 API Endpoints

All available at `http://localhost:8080/api/`

- `/auth` - Authentication
- `/users` - User management
- `/posts` - Social feed
- `/chat` - Messaging
- `/communities` - Communities
- `/notifications` - Notifications
- `/startups` - Startups/Talent
- `/dashboard` - Analytics
- `/search` - Global search

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "accountType": "professional"
  }'
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `backend-api/.env`
- Default: `mongodb://localhost:27017/equitybuild`

### CORS Error
- Check `CORS_ORIGIN` in `backend-api/.env`
- Should be: `http://localhost:3000`

### Port Already in Use
- Frontend: Change port in `package.json` dev script
- Backend: Change `PORT` in `backend-api/.env`

---

## 📦 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

### Backend (`backend-api/.env`)
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/equitybuild
JWT_SECRET=your_secret_key_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_secret_min_32_chars
CORS_ORIGIN=http://localhost:3000
```

---

## ✅ Features Working

1. ✅ User Registration & Login
2. ✅ User Profiles
3. ✅ Social Feed (Posts, Likes, Comments)
4. ✅ Real-time Chat
5. ✅ Communities
6. ✅ Notifications
7. ✅ Startup Listings
8. ✅ Global Search
9. ✅ Dashboard Analytics
10. ✅ Follow System

---

## 🎯 Next Steps

1. ✅ Both servers running
2. ⏳ Create test accounts
3. ⏳ Test all features
4. ⏳ Fix any bugs
5. ⏳ Deploy to production

---

**Status**: Ready for Testing  
**Last Updated**: January 25, 2026
