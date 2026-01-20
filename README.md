# STARTLABX Platform

> AI-Powered Startup Platform - From Idea to MVP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

## 🚀 Overview

STARTLABX is a comprehensive, AI-powered platform designed to help startups and professionals succeed. From validating ideas to hiring team members, everything you need is in one place.

### ✨ Key Features

- **🤖 AI-Powered Tools**: Idea validation, pitch deck generation, MVP planning
- **👥 Resource Marketplace**: Instant hiring (hourly/equity/salary)
- **📝 Contract Generation**: AI-powered legal contracts with e-signature
- **🌐 Social Network**: LinkedIn-style feed and networking
- **💳 Subscription System**: 4 tiers from Free to Enterprise
- **📊 Analytics Dashboard**: Track your startup's progress

## 🎯 Platform Completion: 95%

This is a **production-ready** platform with 70+ files and comprehensive features.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (37 components)
- **State Management**: React Context + Hooks

### Backend
- **Microservices**: 16 services (Spring Boot + Node.js)
- **Databases**: PostgreSQL, MongoDB, Redis
- **Message Queue**: Kafka
- **Search**: Elasticsearch
- **Storage**: MinIO

### AI & Integrations
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe
- **E-Signatures**: DocuSign/HelloSign
- **KYC**: Onfido/Jumio/Persona

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/startlabx.git
cd startlabx

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# API Gateway
NEXT_PUBLIC_API_URL=http://localhost:8080

# Other services
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📚 Documentation

- [Feature Audit](./FEATURE_AUDIT.md) - Complete feature breakdown
- [Final Build Summary](./FINAL_BUILD_SUMMARY.md) - Platform overview
- [Subscription System](./SUBSCRIPTION_SYSTEM.md) - Pricing & plans
- [UI Enhancements](./UI_ENHANCEMENTS_SUMMARY.md) - Design system

## 🎨 Features

### For Startups
- ✅ Validate ideas with AI
- ✅ Generate professional pitch decks
- ✅ Plan MVP roadmaps
- ✅ Find and hire resources
- ✅ Generate legal contracts
- ✅ Build your network
- ✅ Track progress

### For Professionals
- ✅ Find equity opportunities
- ✅ Showcase your skills
- ✅ Get hired (hourly/equity/salary)
- ✅ Build your network
- ✅ AI career guidance

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 5 AI credits, basic features |
| **Starter** | $29/mo | 50 credits, 5 pitch decks |
| **Professional** | $79/mo | 200 credits, unlimited decks |
| **Enterprise** | $299/mo | Unlimited everything |

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t startlabx .

# Run
docker run -p 3000:3000 startlabx
```

## 📊 Project Structure

```
startlabx/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ai-builder/   # AI tools components
│   │   ├── ai-copilot/   # AI assistant components
│   │   ├── marketplace/  # Hiring marketplace
│   │   ├── contracts/    # Contract generation
│   │   ├── subscription/ # Pricing & billing
│   │   └── ui/           # UI components (37)
│   ├── services/         # API services
│   ├── contexts/         # React contexts
│   └── lib/              # Utilities
├── backend/              # Microservices
│   └── ai-copilot-service/
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for Next.js
- Radix UI for components
- Tailwind CSS for styling

## 📧 Contact

- Website: [startlabx.com](https://startlabx.com)
- Email: support@startlabx.com
- Twitter: [@startlabx](https://twitter.com/startlabx)

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for startups and professionals**
