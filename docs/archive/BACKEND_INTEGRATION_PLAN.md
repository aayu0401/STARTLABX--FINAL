# Backend Integration Plan for EquityBuild

## 🎯 Overview

This document outlines how to integrate the **TravelMate microservices backend** with the **EquityBuild Next.js frontend** to create a fully functional startup-talent matching platform.

---

## 📊 Current State Analysis

### **Frontend (EquityBuild)**
- **Framework**: Next.js 15.3.3 with App Router
- **Current Backend**: Firebase (Firestore, Auth, Hosting)
- **AI Integration**: Google Genkit AI
- **UI**: Radix UI + Tailwind CSS
- **Features Needed**:
  - Startup profiles & listings
  - Talent marketplace
  - Project collaboration
  - AI-powered matching
  - Equity management tools

### **Backend (TravelMate Microservices)**
- **Architecture**: Spring Boot microservices
- **Services Available**:
  1. **Auth Service** (Port 8083) - JWT authentication, user management
  2. **User Service** (Port 5000) - Comments, likes, saved items
  3. **Trip Service** (Port 8082) - CRUD operations (adaptable for startups/projects)
  4. **Journal Service** (Port 8081) - Content management (adaptable for profiles)
  5. **AI Service** (Port 8086) - Trending/matching algorithms
  6. **Email Service** (Port 8085) - Notifications
  7. **Gateway** (Port 8080) - API routing
  8. **Eureka Server** (Port 8761) - Service discovery

- **Infrastructure**:
  - PostgreSQL (4 instances for different services)
  - MongoDB (for flexible data)
  - Redis (caching & sessions)
  - Kafka (event streaming)
  - Elasticsearch (search)
  - Nginx (load balancing)

---

## 🔄 Service Mapping Strategy

### **1. Authentication Flow**
**Backend Service**: `authservice` (Port 8083)

**Endpoints to Use**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Token validation
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/user-info` - Get user profile

**Frontend Integration**:
- Replace Firebase Auth with backend JWT authentication
- Update `src/contexts/auth-context.tsx` to use backend APIs
- Store JWT tokens in httpOnly cookies or secure localStorage
- Implement token refresh mechanism

---

### **2. Startup Profiles (Adapted from Trip Service)**
**Backend Service**: `tripservice` (Port 8082)

**Adaptation Strategy**:
- Rename "Trip" entity to "Startup"
- Use existing CRUD operations
- Fields mapping:
  - `title` → `startupName`
  - `description` → `mission`
  - `destination` → `industry`
  - `tags` → `technologies/skills`
  - `images` → `startupImages`

**New Endpoints Needed**:
- `GET /api/startups` - List all startups
- `POST /api/startups` - Create startup profile
- `GET /api/startups/:id` - Get startup details
- `PUT /api/startups/:id` - Update startup
- `DELETE /api/startups/:id` - Delete startup

---

### **3. Talent Profiles (Adapted from Journal Service)**
**Backend Service**: `journalservice` (Port 8081)

**Adaptation Strategy**:
- Rename "Journal" entity to "TalentProfile"
- Use public/private visibility for profile privacy
- Fields mapping:
  - `title` → `professionalTitle`
  - `content` → `bio`
  - `tags` → `skills`
  - `public/private` → `profileVisibility`

**New Endpoints Needed**:
- `GET /api/talent` - Search talent directory
- `POST /api/talent/profile` - Create talent profile
- `GET /api/talent/:id` - Get talent details
- `PUT /api/talent/:id` - Update profile

---

### **4. User Interactions (Comments, Likes, Saves)**
**Backend Service**: `user-service` (Port 5000)

**Direct Usage**:
- `POST /api/user/comments` - Comment on startups/profiles
- `POST /api/user/likes` - Like startups/profiles
- `POST /api/user/saved-trips` → Rename to `saved-startups`

**Frontend Pages**:
- `/startups` - Browse and interact with startups
- `/talent` - Browse and interact with talent profiles

---

### **5. AI-Powered Matching**
**Backend Service**: `ai-service` (Port 8086)

**Current Capabilities**:
- Trending algorithm (aggregates data from multiple services)
- Can be extended for talent-startup matching

**Enhancement Needed**:
- Create new endpoint: `POST /api/ai/match`
- Input: Startup requirements (skills, equity, timeline)
- Output: Ranked list of matching talent profiles
- Algorithm: Score based on:
  - Skills match
  - Experience level
  - Equity expectations
  - Availability

**Integration with Genkit AI**:
- Use Genkit AI on frontend for conversational matching
- Use backend AI service for data aggregation and scoring
- Hybrid approach: Frontend AI for UX, Backend AI for data processing

---

### **6. Project Collaboration**
**Backend Service**: Create new `project-service` (or extend `tripservice`)

**Features Needed**:
- Project creation and management
- Task assignment
- Team collaboration
- Milestone tracking

**Database**: Use PostgreSQL for structured data, MongoDB for flexible project metadata

---

### **7. Email Notifications**
**Backend Service**: `emailservice` (Port 8085)

**Use Cases**:
- Welcome emails
- Match notifications
- Project invitations
- Equity agreement reminders

**Configuration Required**:
- Update `MAIL_USERNAME` and `MAIL_PASSWORD` in docker-compose.yml

---

## 🛠️ Implementation Steps

### **Phase 1: Backend Setup & Customization**

#### **Step 1.1: Customize Services**
```bash
# Navigate to backend directory
cd C:\Users\44743\.gemini\antigravity\scratch\studio\backend

# Create custom branches for EquityBuild
# Modify Trip Service → Startup Service
# Modify Journal Service → Talent Service
```

#### **Step 1.2: Update Database Schemas**
- Modify `scripts/init-trip-database.sql` for startup schema
- Modify `scripts/init-journal-database.sql` for talent schema
- Add new tables for equity management, projects

#### **Step 1.3: Update Docker Compose**
```yaml
# Rename services in docker-compose.yml
startup-service:  # formerly trip-service
  build: ./tripservice
  # ... configuration

talent-service:  # formerly journal-service
  build: ./journalservice
  # ... configuration
```

#### **Step 1.4: Start Backend Services**
```bash
# Build all services
./gradlew build

# Start with Docker Compose
docker-compose up --build

# Verify services
# - Eureka: http://localhost:8761
# - Gateway: http://localhost:8080
# - Individual services health checks
```

---

### **Phase 2: Frontend Integration**

#### **Step 2.1: Create API Client**
```typescript
// src/lib/api-client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const refreshToken = localStorage.getItem('refresh_token');
      // ... implement refresh
    }
    return Promise.reject(error);
  }
);
```

#### **Step 2.2: Create Service Modules**
```typescript
// src/services/auth.service.ts
export const authService = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  validate: () => apiClient.get('/api/auth/validate'),
  // ... more methods
};

// src/services/startup.service.ts
export const startupService = {
  getAll: () => apiClient.get('/api/startups'),
  getById: (id) => apiClient.get(`/api/startups/${id}`),
  create: (data) => apiClient.post('/api/startups', data),
  // ... more methods
};

// src/services/talent.service.ts
export const talentService = {
  search: (filters) => apiClient.get('/api/talent', { params: filters }),
  getProfile: (id) => apiClient.get(`/api/talent/${id}`),
  // ... more methods
};
```

#### **Step 2.3: Update Auth Context**
```typescript
// src/contexts/auth-context.tsx
// Replace Firebase auth with backend JWT auth
// Implement login, register, logout, token refresh
```

#### **Step 2.4: Update Pages**
- `/dashboard` - Fetch user stats from backend
- `/startups` - Use `startupService` for data
- `/talent` - Use `talentService` for data
- `/ai-studio` - Integrate AI matching endpoint

---

### **Phase 3: New Features Development**

#### **Step 3.1: Equity Management Module**
- Create new backend service: `equity-service`
- Database: PostgreSQL for equity agreements
- Features:
  - Equity offer creation
  - Agreement templates
  - Vesting schedules
  - Cap table management

#### **Step 3.2: Enhanced AI Matching**
- Extend `ai-service` with Gemini AI integration
- Implement personality-based matching
- Skills compatibility scoring
- Equity expectation matching

#### **Step 3.3: Real-time Collaboration**
- Add WebSocket support to `project-service`
- Real-time task updates
- Chat functionality
- Notifications

---

## 🔐 Security Considerations

### **1. JWT Token Management**
- Store access tokens in memory or httpOnly cookies
- Store refresh tokens securely
- Implement token rotation
- Set appropriate expiration times

### **2. CORS Configuration**
```yaml
# In gateway service
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:3000"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
```

### **3. Environment Variables**
```env
# .env.local (Frontend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
GEMINI_API_KEY=your_gemini_key

# Backend services (docker-compose.yml)
JWT_SECRET=your_secret_key
DB_PASSWORD=secure_password
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password
```

---

## 📊 Database Schema Updates

### **Startups Table** (PostgreSQL)
```sql
CREATE TABLE startups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mission TEXT,
    industry VARCHAR(100),
    stage VARCHAR(50), -- seed, series-a, etc.
    equity_offered DECIMAL(5,2),
    technologies TEXT[],
    team_size INTEGER,
    founded_date DATE,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Talent Profiles Table** (PostgreSQL)
```sql
CREATE TABLE talent_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    professional_title VARCHAR(255),
    bio TEXT,
    skills TEXT[],
    experience_years INTEGER,
    equity_expectation DECIMAL(5,2),
    hourly_rate DECIMAL(10,2),
    availability VARCHAR(50), -- full-time, part-time, freelance
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    visibility VARCHAR(20) DEFAULT 'public', -- public, private
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Projects Table** (PostgreSQL)
```sql
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    startup_id BIGINT REFERENCES startups(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50), -- planning, active, completed
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_members (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id),
    user_id BIGINT REFERENCES users(id),
    role VARCHAR(100),
    equity_share DECIMAL(5,2),
    joined_at TIMESTAMP DEFAULT NOW()
);
```

### **Equity Agreements Table** (PostgreSQL)
```sql
CREATE TABLE equity_agreements (
    id BIGSERIAL PRIMARY KEY,
    startup_id BIGINT REFERENCES startups(id),
    talent_id BIGINT REFERENCES users(id),
    equity_percentage DECIMAL(5,2),
    vesting_period_months INTEGER,
    cliff_months INTEGER,
    agreement_date DATE,
    status VARCHAR(50), -- pending, active, completed
    document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment Strategy

### **Development Environment**
```bash
# Backend
cd backend
docker-compose up

# Frontend
cd ..
npm install
npm run dev
```

### **Production Environment**
1. **Backend**: Deploy to Railway/AWS/GCP
   - Use Kubernetes for orchestration (k8s configs available)
   - Configure production profiles
   - Set up monitoring (Prometheus + Grafana)

2. **Frontend**: Deploy to Vercel/Firebase Hosting
   - Update API_BASE_URL to production gateway
   - Configure environment variables
   - Enable CDN for static assets

---

## 📝 API Documentation

### **Generate API Docs**
```bash
# Add Swagger/OpenAPI to Spring Boot services
# Access at: http://localhost:8080/swagger-ui.html
```

### **Postman Collection**
- Use existing `TravelMate-API-Collection.postman_collection.json`
- Update endpoints for EquityBuild entities
- Share with frontend team

---

## ✅ Testing Strategy

### **Backend Tests**
```bash
# Run unit tests
./gradlew test

# Run integration tests
./gradlew integrationTest
```

### **Frontend Tests**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### **API Testing**
- Use Postman collection
- Automated API tests with Jest/Supertest
- Load testing with k6 or JMeter

---

## 📈 Monitoring & Observability

### **Backend Monitoring**
- **Zipkin**: Distributed tracing (Port 9411)
- **Prometheus**: Metrics collection (Port 9090)
- **Grafana**: Dashboards (Port 3000)
- **ELK Stack**: Log aggregation (optional)

### **Frontend Monitoring**
- **Vercel Analytics**: Performance metrics
- **Sentry**: Error tracking
- **Google Analytics**: User behavior

---

## 🎯 Next Steps

1. ✅ **Clone both repositories** (DONE)
2. 🔄 **Customize backend services** for EquityBuild entities
3. 🔄 **Update database schemas** with new tables
4. 🔄 **Start backend services** with Docker Compose
5. 🔄 **Create API client** in frontend
6. 🔄 **Update auth context** to use backend JWT
7. 🔄 **Integrate services** in frontend pages
8. 🔄 **Test end-to-end flow**
9. 🔄 **Deploy to staging**
10. 🔄 **Production deployment**

---

## 📚 Resources

- **Backend Architecture**: `backend/Architecture.png`
- **Deployment Guide**: `backend/DEPLOYMENT-README.md`
- **Auth Migration**: `backend/AUTHENTICATION_MIGRATION.md`
- **API Collection**: `backend/TravelMate-API-Collection.postman_collection.json`
- **Frontend Docs**: `docs/blueprint.md`

---

## 🤝 Team Collaboration

### **Recommended Workflow**
1. Backend team: Customize services, update schemas
2. Frontend team: Create API client, update contexts
3. Integration: Connect frontend to backend APIs
4. Testing: End-to-end testing of all features
5. Deployment: Staged rollout to production

---

**Last Updated**: 2025-12-28
**Status**: Planning Phase
**Next Review**: After backend customization
