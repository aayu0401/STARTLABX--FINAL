# 🚀 STARTLABX - Complete Deployment Guide

## ✅ Current Status
- **Frontend**: Next.js 15 with Real-Time WebSocket
- **Backend API**: Express.js with Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Real-Time**: Socket.IO for live updates

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend-api
npm install
cd ..

# Generate Prisma client
npx prisma generate
```

### 2. Database Setup

```bash
# Create database and run migrations
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and update:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_WS_URL="http://localhost:3002"
```

---

## 🏃 Running the Application

### Development Mode (Recommended)

**Option 1: Run all services together**
```bash
npm run dev:all
```

**Option 2: Run services separately**

Terminal 1 - Frontend + WebSocket:
```bash
npm run dev
```

Terminal 2 - Backend API:
```bash
cd backend-api
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

---

## 🎯 Features Overview

### ✅ Implemented Features

#### 1. **Authentication & User Management**
- JWT-based authentication
- User registration and login
- Profile management
- Role-based access control

#### 2. **Social Feed**
- Real-time post updates
- Like, comment, share functionality
- Post filtering (All, Following, Trending)
- Live engagement counters

#### 3. **Real-Time Features**
- WebSocket connection with auto-reconnect
- Live feed updates
- Typing indicators
- User presence tracking
- Real-time notifications
- Live analytics updates

#### 4. **Talent Marketplace**
- Browse professionals
- Filter by skills, availability, rate
- Save favorite talent
- View detailed profiles

#### 5. **Startup Management**
- Create and manage startups
- Startup discovery
- Founder profiles
- Stage tracking

#### 6. **Communities**
- Create and join communities
- Community posts
- Member management
- Category-based discovery

#### 7. **Analytics Dashboard**
- Real-time metrics
- Growth charts
- Engagement tracking
- Activity feed

#### 8. **Messaging**
- Real-time chat
- Typing indicators
- Read receipts
- Conversation management

#### 9. **Notifications**
- Real-time push notifications
- Notification center
- Mark as read functionality
- Multiple notification types

---

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Radix UI
- **State Management**: React Context + Hooks
- **Real-Time**: Socket.IO Client
- **Charts**: Recharts

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-Time**: Socket.IO Server
- **Database**: SQLite (dev) / PostgreSQL (prod)

### Real-Time Architecture
- **WebSocket**: Socket.IO with rooms
- **Events**: Pub/Sub pattern
- **Reconnection**: Automatic with exponential backoff
- **Presence**: Active user tracking
- **Heartbeat**: Periodic ping/pong

---

## 📁 Project Structure

```
startlabx/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (app)/             # Protected app pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Radix UI components
│   │   ├── feed/              # Feed components
│   │   ├── realtime/          # Real-time status components
│   │   └── ...
│   ├── services/
│   │   └── realtime.service.ts # WebSocket service
│   ├── hooks/
│   │   └── useRealtime.ts     # Real-time hooks
│   └── lib/                   # Utilities
├── backend-api/
│   ├── server.js              # Express API server
│   ├── package.json
│   └── .env
├── prisma/
│   └── schema.prisma          # Database schema
├── server.ts                  # Next.js + Socket.IO server
└── package.json
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (talent marketplace)
- `PUT /api/users/:id` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post
- `POST /api/posts/:id/comments` - Add comment

### Startups
- `GET /api/startups` - Get all startups
- `POST /api/startups` - Create startup

### Communities
- `GET /api/communities` - Get all communities
- `POST /api/communities/:id/join` - Join community

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

---

## 🔄 Real-Time Events

### Feed Events
- `join_feed` - Subscribe to feed updates
- `new_post` - New post created
- `post_liked` - Post was liked
- `post_commented` - New comment added

### Chat Events
- `join_conversation` - Join chat room
- `send_message` - Send message
- `receive_message` - Receive message
- `typing` - Typing indicator

### Notification Events
- `subscribe_notifications` - Subscribe to notifications
- `new_notification` - New notification received

### Presence Events
- `user_online` - User came online
- `user_offline` - User went offline
- `update_presence` - Update user status

### Analytics Events
- `subscribe_analytics` - Subscribe to analytics
- `analytics_update` - Analytics data updated

---

## 🎨 UI/UX Features

### Design System
- **Colors**: Premium gradient palette
- **Typography**: Poppins, Inter, Lexend Deca
- **Effects**: Glassmorphism, gradients, shadows
- **Animations**: Smooth transitions, micro-interactions
- **Responsive**: Mobile-first design

### Animations
- Fade-in for new content
- Slide-in for modals
- Bounce for notifications
- Pulse for live indicators
- Hover effects on all interactive elements

### Accessibility
- WCAG compliant
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

---

## 🚀 Deployment

### Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Backend Deployment Options

#### Option 1: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Render
1. Connect GitHub repository
2. Select backend-api folder
3. Set environment variables
4. Deploy

#### Option 3: Docker
```bash
# Build image
docker build -t startlabx-backend ./backend-api

# Run container
docker run -p 8080:8080 startlabx-backend
```

### Database Migration (Production)

For production, switch to PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

Then run:
```bash
npx prisma migrate deploy
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Create and view posts
- [ ] Like and comment on posts
- [ ] Real-time feed updates
- [ ] WebSocket connection status
- [ ] User profile updates
- [ ] Talent marketplace search
- [ ] Community join/leave
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Mobile responsiveness

### Performance Metrics
- **Initial Load**: < 2 seconds
- **Page Navigation**: < 500ms
- **Real-time Update**: < 100ms
- **WebSocket Reconnection**: < 3 seconds

---

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Reset database
npx prisma db push --force-reset
npx prisma generate
```

**2. WebSocket Connection Failed**
- Check if server is running on port 3002
- Verify NEXT_PUBLIC_WS_URL in .env.local
- Check browser console for errors

**3. Backend API Not Responding**
- Ensure backend is running on port 8080
- Check backend-api/.env configuration
- Verify database connection

**4. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📊 Performance Optimization

### Implemented Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Efficient re-renders
- Debounced events
- Memoized components
- Connection pooling

### Future Optimizations
- Server-side rendering (SSR)
- Static site generation (SSG)
- CDN integration
- Database indexing
- Caching layer (Redis)

---

## 🔐 Security Best Practices

### Implemented
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)

### Recommended for Production
- HTTPS enforcement
- Rate limiting
- CSRF protection
- Environment variable encryption
- Regular security audits

---

## 📈 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: Vercel Analytics, New Relic
- **Uptime**: UptimeRobot, Pingdom
- **Logs**: LogRocket, Datadog

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

---

## 📝 Next Steps

### Phase 1: Core Features (✅ Complete)
- [x] Authentication system
- [x] Real-time feed
- [x] User profiles
- [x] Basic analytics

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] File uploads (images, documents)
- [ ] Advanced search
- [ ] Email notifications
- [ ] Payment integration

### Phase 3: Advanced Features (📋 Planned)
- [ ] Video chat
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@startlabx.com
- **Discord**: [Join our community]

---

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ for startups and professionals**

Last Updated: February 5, 2026
