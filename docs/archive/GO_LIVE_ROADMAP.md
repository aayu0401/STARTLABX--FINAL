# 🚀 Go-Live Roadmap: From Prototype to Production

This document outlines the concrete steps required to transition the application from its current "High-Fidelity Prototype" state (using mock data) to a fully functional, production-ready application.

## 🛑 Critical Blockers (Must Fix Before Live)

### 1. Database Integration (Replace Mock Data)
The current application uses `mockDb` (in-memory arrays) for all data. This data is lost on every restart.
- [ ] **Configure Database**: Switch `prisma/schema.prisma` from `sqlite` (with file path) to `postgresql`.
- [ ] **Provision Database**: Set up a PostgreSQL instance (e.g., Supabase, Neon, AWS RDS, or local Docker).
- [ ] **Run Migrations**: Execute `npx prisma migrate dev` to create actual tables.
- [ ] **Seed Data**: Update `prisma/seed.ts` to populate the real DB with initial categories, test users, etc.

### 2. API Route Rewrite (The "Real" Backend)
Rewrite all API routes in `src/app/api/` to use `prisma` client instead of `mockDb`.

#### **Authentication** (`src/app/api/auth/`)
- [ ] **Register (`/register`)**: 
    - Check if email exists in DB.
    - Hash password using `bcryptjs`.
    - Create `User` record in DB.
    - Generate real JWT token.
- [ ] **Login (`/login`)**: 
    - Find user by email.
    - Validate password hash.
    - Return real JWT token.
- [ ] **Session (`/me`)**: Decode JWT from header and fetch user from DB.

#### **Core Features**
- [ ] **Posts (`/api/posts`)**:
    - `GET`: Fetch posts from DB with pagination (infinite scroll).
    - `POST`: Create new post in DB (handle image URLs properly).
- [ ] **Engagement**:
    - Implement `/api/posts/[id]/like`.
    - Implement `/api/posts/[id]/comment`.
- [ ] **Dashboard (`/api/dashboard`)**:
    - Write aggregation queries (count views, likes, etc.) to replace hardcoded stats.

### 3. Real-Time Chat System
Currently, chat is "faked" with `setTimeout`.
- [ ] **Socket Server**: Set up a custom Next.js server or separate Node.js service for `Socket.IO`.
    - *Alternative*: Use a managed service like **Pusher** or **Supabase Realtime** to avoid custom server complexities.
- [ ] **Chat API**:
    - `POST /api/chat/send`: Save message to DB **AND** emit socket event.
    - `GET /api/chat/history`: Fetch conversation history from DB.
- [ ] **Frontend Client**:
    - Initialize `socket.io-client` with the real server URL.
    - Listen for `message:received` events to update UI instantly.

---

## 🛠 Deployment & Infrastructure

### 4. Environment Configuration
Create a production-ready `.env` file. Do **NOT** commit this to Git.
```env
# Production Config
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
JWT_SECRET="<generate_long_random_string>"
NEXT_PUBLIC_API_URL="https://your-domain.com"
NEXT_PUBLIC_SOCKET_URL="wss://your-domain.com"
```

### 5. Build & Hosting
- [ ] **Docker**: Create a `Dockerfile` for the application.
- [ ] **CI/CD**: Set up GitHub Actions to build and test on push.
- [ ] **Storage**: Configure an object storage service (AWS S3, Cloudinary, or UploadThing) for user uploads (avatars, post images). *Currently, uploads might fail or only work locally.*

---

## 🎨 Final Polish

### 6. Missing Pages & Cleanup
- [ ] **Connect Remaining Pages**: Ensure `Profile`, `Settings`, and `Startup` pages fetch data from the new API routes.
- [ ] **Delete Mocks**: Once verified, delete:
    - `src/lib/mock-db.ts`
    - `src/lib/mock-chat.ts`
- [ ] **Error Handling**: Ensure properly styled error pages (404, 500) are shown instead of generic browser errors.

## 📋 Recommended Execution Order
1.  **Database Setup** (Get the foundation ready)
2.  **Auth API** (Enable users to sign up/in)
3.  **Posts/Feed API** (Core value prod)
4.  **Dashboard/Analytics API** (Data visualization)
5.  **Real-Time Chat** (Complexity layer)
6.  **Deployment** (Go Live)
