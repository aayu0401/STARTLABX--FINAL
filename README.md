# STARTLABX - AI-Powered Startup Platform

> **Complete Full-Stack Platform** - From Idea Validation to MVP Launch

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🚀 Overview

STARTLABX is a comprehensive platform that helps startups succeed through AI-powered tools, talent marketplace, and social networking features.

### ✨ Key Features

- 🤖 **AI-Powered Tools** - Idea validation, pitch deck generation, MVP planning, AI copilot
- 👥 **Talent Marketplace** - Hire professionals on hourly/equity/salary basis
- 📱 **Social Network** - LinkedIn-style feed, communities, real-time messaging
- 📊 **Analytics Dashboard** - Track your startup's progress
- 💳 **Subscription System** - 4-tier pricing (Free, Starter, Pro, Enterprise)
- 🔐 **Secure Authentication** - JWT-based auth with token refresh

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom Design System
- **UI**: Radix UI + Premium Components
- **State**: React Context + Hooks

### Backend (16 Microservices)
- API Gateway, Auth, User, AI, Marketplace, Social, Analytics
- Chat (WebSocket), Notifications, Contracts, Subscriptions
- Payment, Storage, Search, Email, Incubator

### Databases
- PostgreSQL (User data, startups)
- MongoDB (Posts, messages)
- Redis (Sessions, cache)
- Elasticsearch (Search)

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/startlabx.git
cd startlabx

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8087

# OpenAI
OPENAI_API_KEY=your_openai_key

# Stripe
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📁 Project Structure

```
startlabx/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (app)/             # Protected pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Radix UI components
│   │   └── premium/           # Custom premium components
│   ├── services/              # Backend API services
│   ├── lib/                   # Utilities
│   └── styles/                # Global styles
├── backend/                   # Microservices
└── package.json
```

## 🎨 Features

### AI-Powered Tools
- **Idea Validator** - Validate startup ideas with AI analysis
- **Pitch Deck Generator** - Create professional pitch decks
- **MVP Planner** - Generate detailed MVP roadmaps
- **AI Copilot** - Get personalized startup guidance

### Talent Marketplace
- Browse professionals by skills
- Filter by hourly/equity/salary
- View detailed profiles
- Generate contracts with AI
- E-signature integration

### Social Features
- LinkedIn-style feed
- Post creation and interactions
- Communities
- Real-time messaging
- Notifications

### Business Tools
- Startup listings
- Dashboard analytics
- Project collaboration
- Incubator programs

## 💳 Subscription Tiers

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| AI Credits | 5 | 50 | 200 | Unlimited |
| Pitch Decks | 1 | 5 | Unlimited | Unlimited |
| Team Members | 1 | 3 | 10 | Unlimited |
| Support | Community | Email | Priority | Dedicated |
| Price | $0 | $29/mo | $79/mo | $299/mo |

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t startlabx .
docker run -p 3000:3000 startlabx
```

### Manual
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Backend Services](./docs/BACKEND.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- Next.js team
- Radix UI
- Tailwind CSS
- OpenAI

## 📧 Contact

- Website: [startlabx.com](https://startlabx.com)
- Email: support@startlabx.com
- Twitter: [@startlabx](https://twitter.com/startlabx)

---

**Built with ❤️ for startups and professionals**
