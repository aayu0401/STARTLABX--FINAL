# Firebase to Backend Migration Plan

## 🎯 Objective

Completely replace Firebase services with the custom microservices backend, creating a fully self-hosted, scalable platform.

---

## 📊 Current Firebase Usage vs Backend Replacement

### **Firebase Services Currently Used**

| Firebase Service | Current Usage | Backend Replacement | Status |
|-----------------|---------------|---------------------|--------|
| **Firebase Authentication** | User login/signup, JWT tokens | Auth Service (8083) | ✅ Ready |
| **Firestore Database** | User data, profiles, startups | PostgreSQL + MongoDB | ✅ Ready |
| **Firebase Storage** | File uploads, images | S3-compatible (MinIO) | 🔄 To Add |
| **Firebase Hosting** | Static site hosting | Nginx + CDN | 🔄 To Add |
| **Firebase Cloud Functions** | Serverless functions | Microservices | ✅ Ready |
| **Firebase Cloud Messaging** | Push notifications | Notification Service | 🔄 To Add |
| **Firebase Analytics** | User analytics | Dashboard Service | ✅ Ready |

---

## 🔄 Migration Strategy

### **Phase 1: Authentication Migration**

#### **From: Firebase Authentication**
```typescript
// Current Firebase Auth
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
await signInWithEmailAndPassword(auth, email, password);
```

#### **To: Backend Auth Service**
```typescript
// New Backend Auth
import { authService } from '@/services/auth.service';

const response = await authService.login({ email, password });
const { token, refreshToken, user } = response.data;

// Store tokens
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);
```

#### **Migration Steps**
1. ✅ Auth Service already exists (Port 8083)
2. 🔄 Update frontend auth context
3. 🔄 Migrate user data from Firebase Auth to PostgreSQL
4. 🔄 Update all API calls to use JWT tokens
5. 🔄 Remove Firebase Auth SDK

---

### **Phase 2: Database Migration**

#### **From: Firestore**
```typescript
// Current Firestore
import { collection, getDocs } from 'firebase/firestore';

const querySnapshot = await getDocs(collection(db, "startups"));
```

#### **To: Backend Services**
```typescript
// New Backend Services
import { startupService } from '@/services/startup.service';

const startups = await startupService.getAll();
```

#### **Data Migration**

**Firestore Collections → Backend Services**

| Firestore Collection | Backend Service | Database | Port |
|---------------------|-----------------|----------|------|
| `users` | Auth Service | PostgreSQL (auth_db) | 8083 |
| `startups` | Startup Service | PostgreSQL (startup_db) | 8082 |
| `professionals` | Talent Service | PostgreSQL (talent_db) | 8081 |
| `posts` | Post Service | PostgreSQL (post_db) | 8089 |
| `communities` | Community Service | PostgreSQL (community_db) | 8090 |
| `messages` | Chat Service | MongoDB (chat_db) | 8087 |
| `analytics` | Dashboard Service | PostgreSQL + InfluxDB | 8088 |

#### **Migration Script**
```typescript
// scripts/migrate-firestore-to-backend.ts

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { apiClient } from './api-client';

async function migrateUsers() {
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').get();
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    
    // Migrate to backend
    await apiClient.post('/api/auth/migrate-user', {
      firebaseId: doc.id,
      ...userData
    });
  }
}

async function migrateStartups() {
  const db = getFirestore();
  const startupsSnapshot = await db.collection('startups').get();
  
  for (const doc of startupsSnapshot.docs) {
    const startupData = doc.data();
    
    await apiClient.post('/api/startups/migrate', {
      firebaseId: doc.id,
      ...startupData
    });
  }
}

// Run migrations
await migrateUsers();
await migrateStartups();
// ... migrate other collections
```

---

### **Phase 3: File Storage Migration**

#### **From: Firebase Storage**
```typescript
// Current Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storageRef = ref(storage, `images/${file.name}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

#### **To: MinIO (S3-compatible)**
```typescript
// New MinIO Storage
import { storageService } from '@/services/storage.service';

const uploadResult = await storageService.upload(file, 'images');
const url = uploadResult.url;
```

#### **Setup MinIO**

Add to `docker-compose.yml`:
```yaml
minio:
  image: minio/minio:latest
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
  networks:
    - travel-mate-network

volumes:
  minio_data:
```

#### **Create Storage Service**
```typescript
// backend/storage-service/src/app.ts

import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

app.post('/api/storage/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const key = `${Date.now()}-${file.originalname}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: 'equitybuild',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  const url = `${process.env.S3_ENDPOINT}/equitybuild/${key}`;
  res.json({ url });
});
```

---

### **Phase 4: Push Notifications**

#### **From: Firebase Cloud Messaging (FCM)**
```typescript
// Current FCM
import { getMessaging } from 'firebase/messaging';

const messaging = getMessaging();
await messaging.send({
  token: deviceToken,
  notification: {
    title: 'New Message',
    body: 'You have a new message'
  }
});
```

#### **To: Notification Service**
```typescript
// New Notification Service
import { notificationService } from '@/services/notification.service';

await notificationService.send({
  userId: '123',
  type: 'message',
  title: 'New Message',
  body: 'You have a new message'
});
```

#### **Create Notification Service**

**Tech Stack**: Node.js + Express + Firebase Admin SDK (for FCM) + WebPush

```typescript
// backend/notification-service/src/app.ts

import admin from 'firebase-admin';
import webpush from 'web-push';

// Initialize Firebase Admin for FCM
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/api/notifications/send', async (req, res) => {
  const { userId, title, body, data } = req.body;
  
  // Get user's device tokens from database
  const tokens = await getUserDeviceTokens(userId);
  
  // Send via FCM
  const message = {
    notification: { title, body },
    data,
    tokens,
  };
  
  await admin.messaging().sendMulticast(message);
  
  // Also send web push for browsers
  const subscription = await getUserWebPushSubscription(userId);
  if (subscription) {
    await webpush.sendNotification(subscription, JSON.stringify({
      title,
      body,
      data,
    }));
  }
  
  res.json({ success: true });
});
```

Add to `docker-compose.yml`:
```yaml
notification-service:
  build: ./notification-service
  ports:
    - "8091:8091"
  environment:
    NODE_ENV: docker
    DATABASE_URL: postgresql://traveluser:postgres@postgres-notification:5432/notification_db
    FIREBASE_CREDENTIALS: /app/firebase-credentials.json
    VAPID_PUBLIC_KEY: ${VAPID_PUBLIC_KEY}
    VAPID_PRIVATE_KEY: ${VAPID_PRIVATE_KEY}
  networks:
    - travel-mate-network
```

---

### **Phase 5: Analytics Migration**

#### **From: Firebase Analytics**
```typescript
// Current Firebase Analytics
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'page_view', {
  page_title: 'Dashboard',
  page_location: '/dashboard'
});
```

#### **To: Dashboard Service**
```typescript
// New Dashboard Service
import { analyticsService } from '@/services/analytics.service';

await analyticsService.trackEvent({
  event: 'page_view',
  properties: {
    page_title: 'Dashboard',
    page_location: '/dashboard'
  }
});
```

**Dashboard Service already created** ✅ (Port 8088)

---

## 🏗️ Complete Backend Architecture (Firebase-Free)

### **All Services**

1. **Auth Service** (8083) - Authentication & user management
2. **Startup Service** (8082) - Startup profiles
3. **Talent Service** (8081) - Professional profiles
4. **User Service** (5000) - User interactions
5. **AI Service** (8086) - AI matching & recommendations
6. **Email Service** (8085) - Email notifications
7. **Chat Service** (8087) - Real-time messaging
8. **Dashboard Service** (8088) - Analytics & insights
9. **Post Service** (8089) - Social content
10. **Community Service** (8090) - Communities
11. **Storage Service** (8091) - File storage (MinIO)
12. **Notification Service** (8092) - Push notifications
13. **Gateway** (8080) - API routing
14. **Eureka Server** (8761) - Service discovery
15. **Config Server** (8888) - Configuration

### **Infrastructure**

- **Databases**: PostgreSQL (7 instances), MongoDB (2 instances)
- **Cache**: Redis (with Sentinel)
- **Search**: Elasticsearch
- **Metrics**: InfluxDB
- **Message Queue**: Kafka
- **Storage**: MinIO (S3-compatible)
- **Monitoring**: Prometheus + Grafana
- **Tracing**: Zipkin
- **Load Balancer**: Nginx

---

## 📝 Frontend Changes Required

### **1. Update Environment Variables**

**Remove Firebase config:**
```env
# DELETE THESE
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Add Backend config:**
```env
# ADD THESE
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8087
NEXT_PUBLIC_STORAGE_URL=http://localhost:9000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_key
```

### **2. Update Auth Context**

**File**: `src/contexts/auth-context.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const response = await authService.validate();
      setUser(response.data.user);
    } catch (error) {
      // Token invalid, try refresh
      await refreshToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { token, refreshToken, user } = response.data;
    
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setUser(user);
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    const { token, refreshToken, user } = response.data;
    
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');
      
      const response = await authService.refresh({ refreshToken: refresh });
      const { token, refreshToken: newRefresh, user } = response.data;
      
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', newRefresh);
      setUser(user);
    } catch (error) {
      // Refresh failed, logout
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### **3. Create API Services**

**File**: `src/lib/api-client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });
        
        const { token } = response.data;
        localStorage.setItem('access_token', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**File**: `src/services/auth.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export const authService = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', data),
  
  register: (data: RegisterData) =>
    apiClient.post('/api/auth/register', data),
  
  logout: () =>
    apiClient.post('/api/auth/logout'),
  
  validate: () =>
    apiClient.get('/api/auth/validate'),
  
  refresh: (data: { refreshToken: string }) =>
    apiClient.post('/api/auth/refresh', data),
  
  getUserInfo: () =>
    apiClient.get('/api/auth/user-info'),
};
```

**File**: `src/services/startup.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export const startupService = {
  getAll: (params?: any) =>
    apiClient.get('/api/startups', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/startups/${id}`),
  
  create: (data: any) =>
    apiClient.post('/api/startups', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/api/startups/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/api/startups/${id}`),
};
```

**File**: `src/services/post.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export const postService = {
  getFeed: (params?: any) =>
    apiClient.get('/api/posts/feed', { params }),
  
  create: (data: any) =>
    apiClient.post('/api/posts', data),
  
  like: (postId: string) =>
    apiClient.post(`/api/posts/${postId}/like`),
  
  comment: (postId: string, content: string) =>
    apiClient.post(`/api/posts/${postId}/comment`, { content }),
};
```

**File**: `src/services/chat.service.ts`

```typescript
import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;
  
  connect() {
    const token = localStorage.getItem('access_token');
    
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to chat');
    });
    
    return this.socket;
  }
  
  disconnect() {
    this.socket?.disconnect();
  }
  
  sendMessage(conversationId: string, content: string) {
    this.socket?.emit('send_message', { conversationId, content });
  }
  
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }
}

export const chatService = new ChatService();
```

### **4. Remove Firebase SDK**

**File**: `package.json`

```json
{
  "dependencies": {
    // REMOVE THESE
    // "firebase": "^11.9.1",
    
    // ADD THESE
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.0"
  }
}
```

---

## 🚀 Migration Execution Plan

### **Step 1: Prepare Backend (Week 1)**
- [ ] Set up all microservices
- [ ] Configure databases
- [ ] Set up MinIO for storage
- [ ] Create Notification Service
- [ ] Test all services individually

### **Step 2: Data Migration (Week 2)**
- [ ] Export data from Firestore
- [ ] Create migration scripts
- [ ] Migrate users to Auth Service
- [ ] Migrate startups to Startup Service
- [ ] Migrate files to MinIO
- [ ] Verify data integrity

### **Step 3: Frontend Updates (Week 3)**
- [ ] Update auth context
- [ ] Create API service modules
- [ ] Replace Firebase calls with API calls
- [ ] Update file upload logic
- [ ] Test authentication flow

### **Step 4: Feature Migration (Week 4)**
- [ ] Migrate social features to Post Service
- [ ] Migrate chat to Chat Service
- [ ] Migrate analytics to Dashboard Service
- [ ] Migrate communities to Community Service
- [ ] Test all features

### **Step 5: Testing & Deployment (Week 5)**
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security audit
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Production deployment

---

## ✅ Benefits of Migration

### **Cost Savings**
- 💰 **No Firebase costs** (pay-as-you-go eliminated)
- 💰 **Self-hosted infrastructure** (predictable costs)
- 💰 **No vendor lock-in**

### **Performance**
- ⚡ **Lower latency** (direct database access)
- ⚡ **Better caching** (Redis optimization)
- ⚡ **Optimized queries** (custom database design)

### **Scalability**
- 📈 **Horizontal scaling** (microservices)
- 📈 **Independent service scaling**
- 📈 **Better resource utilization**

### **Control**
- 🔧 **Full data ownership**
- 🔧 **Custom business logic**
- 🔧 **Advanced features** (not limited by Firebase)

### **Features**
- ✨ **Real-time chat** (Socket.IO)
- ✨ **Advanced analytics** (InfluxDB)
- ✨ **Full-text search** (Elasticsearch)
- ✨ **Event-driven architecture** (Kafka)

---

## 📊 Migration Checklist

### **Backend Setup**
- [ ] All 15 microservices running
- [ ] All databases configured
- [ ] MinIO storage operational
- [ ] Kafka event streaming working
- [ ] Redis caching configured
- [ ] Elasticsearch indexed
- [ ] Monitoring setup (Prometheus + Grafana)

### **Data Migration**
- [ ] Users migrated
- [ ] Startups migrated
- [ ] Professionals migrated
- [ ] Posts migrated
- [ ] Communities migrated
- [ ] Files migrated to MinIO
- [ ] Analytics data migrated

### **Frontend Updates**
- [ ] Firebase SDK removed
- [ ] Auth context updated
- [ ] API services created
- [ ] All pages updated
- [ ] File uploads working
- [ ] Push notifications working
- [ ] Analytics tracking working

### **Testing**
- [ ] Authentication tested
- [ ] CRUD operations tested
- [ ] Real-time features tested
- [ ] File uploads tested
- [ ] Search tested
- [ ] Analytics tested
- [ ] Performance tested

### **Deployment**
- [ ] Staging deployment
- [ ] Production deployment
- [ ] DNS configured
- [ ] SSL certificates
- [ ] Monitoring active
- [ ] Backups configured

---

**Status**: Ready to Execute
**Timeline**: 5 weeks
**Next Step**: Set up backend infrastructure
