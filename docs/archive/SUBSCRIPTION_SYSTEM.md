# 💳 Subscription System Documentation

## Overview

Complete subscription and pricing system with 4 tiers, Stripe integration, feature gating, and usage tracking.

---

## 📦 Subscription Plans

### Free Plan
**Price**: $0/month

**Features**:
- 5 AI credits per month
- 1 pitch deck
- 1 MVP plan
- 2 contracts
- Community support
- Basic analytics
- 1GB storage

**Perfect for**: Exploring the platform

---

### Starter Plan
**Price**: $29/month ($23.20/month yearly)

**Features**:
- 50 AI credits per month
- 5 pitch decks
- 3 MVP plans
- 10 contracts
- Up to 3 team members
- Email support
- Advanced analytics
- 5GB storage

**Perfect for**: Early-stage startups

---

### Professional Plan ⭐ POPULAR
**Price**: $79/month ($63.20/month yearly)

**Features**:
- 200 AI credits per month
- **Unlimited** pitch decks
- **Unlimited** MVP plans
- **Unlimited** contracts
- Up to 10 team members
- **Priority support**
- **Custom branding**
- Advanced analytics
- 25GB storage
- **API access**

**Perfect for**: Growing startups

---

### Enterprise Plan
**Price**: $299/month ($239.20/month yearly)

**Features**:
- **Unlimited** AI credits
- **Unlimited** everything
- **Unlimited** team members
- Dedicated account manager
- **24/7 priority support**
- Custom branding
- White-label options
- Advanced analytics
- **Unlimited** storage
- Full API access
- Custom integrations
- **SLA guarantee**

**Perfect for**: Established companies

---

## 🎯 Feature Limits

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| AI Credits/month | 5 | 50 | 200 | ∞ |
| Pitch Decks | 1 | 5 | ∞ | ∞ |
| MVP Plans | 1 | 3 | ∞ | ∞ |
| Contracts | 2 | 10 | ∞ | ∞ |
| Team Members | 1 | 3 | 10 | ∞ |
| Storage | 1GB | 5GB | 25GB | ∞ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |

---

## 💰 Pricing

### Monthly Billing
- Free: $0
- Starter: $29
- Professional: $79
- Enterprise: $299

### Yearly Billing (20% discount)
- Free: $0
- Starter: $278.40/year ($23.20/month)
- Professional: $758.40/year ($63.20/month)
- Enterprise: $2,870.40/year ($239.20/month)

**Savings**:
- Starter: Save $69.60/year
- Professional: Save $189.60/year
- Enterprise: Save $716.40/year

---

## 🔧 Implementation

### Files Created

1. **Subscription Service** (`src/services/subscription.service.ts`)
   - Plan definitions
   - API methods
   - Feature checking
   - Stripe integration

2. **Pricing Page** (`src/app/(app)/pricing/page.tsx`)
   - Plan cards
   - Monthly/yearly toggle
   - Feature comparison table
   - FAQ section

3. **Subscription Management** (`src/app/(app)/subscription/page.tsx`)
   - Current plan display
   - Usage tracking
   - Billing management
   - Cancel/upgrade options

4. **Feature Gate** (`src/components/subscription/feature-gate.tsx`)
   - Feature access control
   - Upgrade prompts
   - Premium badges
   - Subscription hook

---

## 🚀 Usage Examples

### Check Feature Access

```tsx
import { FeatureGate } from '@/components/subscription/feature-gate';

<FeatureGate feature="pitchDecks">
  <PitchDeckBuilder />
</FeatureGate>
```

### Use Subscription Hook

```tsx
import { useSubscription } from '@/components/subscription/feature-gate';

function MyComponent() {
  const { subscription, isPremium, canUseFeature } = useSubscription();

  if (isPremium()) {
    return <PremiumFeature />;
  }

  return <FreeFeature />;
}
```

### Display Premium Badge

```tsx
import { PremiumBadge } from '@/components/subscription/feature-gate';

<div>
  <h3>Advanced Analytics</h3>
  <PremiumBadge />
</div>
```

---

## 🔌 Stripe Integration

### Setup Required

1. **Create Stripe Account**
   - Sign up at https://stripe.com
   - Get API keys (test + production)

2. **Create Products & Prices**
   ```bash
   # Starter Plan
   stripe products create --name="Starter" --description="For early-stage startups"
   stripe prices create --product=prod_xxx --unit-amount=2900 --currency=usd --recurring[interval]=month

   # Professional Plan
   stripe products create --name="Professional" --description="For growing startups"
   stripe prices create --product=prod_xxx --unit-amount=7900 --currency=usd --recurring[interval]=month

   # Enterprise Plan
   stripe products create --name="Enterprise" --description="For established companies"
   stripe prices create --product=prod_xxx --unit-amount=29900 --currency=usd --recurring[interval]=month
   ```

3. **Update Price IDs**
   - Update `stripePriceId` in `subscription.service.ts`

4. **Configure Webhooks**
   - Set webhook URL: `https://yourdomain.com/api/webhooks/stripe`
   - Listen for events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

---

## 📊 Backend API Endpoints

### Required Endpoints

```typescript
// Get current subscription
GET /api/subscriptions/current

// Get usage
GET /api/subscriptions/usage

// Create checkout session
POST /api/subscriptions/checkout
Body: { planId: string }

// Create portal session
POST /api/subscriptions/portal

// Upgrade subscription
POST /api/subscriptions/upgrade
Body: { planId: string }

// Cancel subscription
POST /api/subscriptions/cancel
Body: { immediately: boolean }

// Resume subscription
POST /api/subscriptions/resume

// Check feature access
GET /api/subscriptions/can-use/:feature
```

---

## 🎨 UI Components

### Pricing Page Features
- ✅ 4 plan cards with icons
- ✅ Monthly/yearly toggle
- ✅ 20% yearly discount
- ✅ Popular badge
- ✅ Feature comparison table
- ✅ FAQ section
- ✅ Responsive design
- ✅ Current plan indicator

### Subscription Page Features
- ✅ Current plan display
- ✅ Usage tracking with progress bars
- ✅ Color-coded usage warnings
- ✅ Manage subscription button
- ✅ Cancel/upgrade options
- ✅ Billing history link
- ✅ Period dates

### Feature Gate
- ✅ Automatic access control
- ✅ Upgrade prompts
- ✅ Premium badges
- ✅ Custom fallbacks

---

## 💡 Feature Gating Strategy

### Soft Limits
- Show upgrade prompt when limit reached
- Allow viewing but not creating
- Display usage warnings at 70%, 90%

### Hard Limits
- Block feature access completely
- Show upgrade modal
- Redirect to pricing page

### Implementation

```tsx
// Soft limit example
if (usage.pitchDecks >= limit && limit !== -1) {
  return <UpgradePrompt />;
}

// Hard limit example
<FeatureGate feature="contracts">
  <ContractGenerator />
</FeatureGate>
```

---

## 📈 Usage Tracking

### Tracked Metrics
- AI credits used
- Pitch decks created
- MVP plans generated
- Contracts created
- Storage used (GB)

### Reset Schedule
- Monthly on subscription renewal date
- Immediate on upgrade
- Pro-rated on downgrade

---

## 🔒 Security

### Best Practices
1. Verify webhook signatures
2. Check subscription status server-side
3. Validate feature access on backend
4. Use Stripe Customer Portal for sensitive operations
5. Implement rate limiting
6. Log all subscription changes

---

## 🎯 Conversion Strategy

### Free to Paid
- Show upgrade prompts at limits
- Highlight premium features
- Offer 14-day money-back guarantee
- Display success stories

### Starter to Professional
- Emphasize unlimited features
- Show time savings
- Highlight priority support
- Offer annual discount

### Professional to Enterprise
- Dedicated account manager
- Custom integrations
- SLA guarantees
- White-label options

---

## 📊 Analytics to Track

### Key Metrics
- Monthly Recurring Revenue (MRR)
- Churn rate
- Upgrade rate
- Feature usage by plan
- Limit hit frequency
- Conversion funnel

### Recommended Tools
- Stripe Dashboard (revenue)
- Google Analytics (traffic)
- Mixpanel (user behavior)
- Segment (data pipeline)

---

## 🚀 Launch Checklist

- [ ] Set up Stripe account
- [ ] Create products and prices
- [ ] Update price IDs in code
- [ ] Configure webhooks
- [ ] Test checkout flow
- [ ] Test subscription management
- [ ] Test feature gating
- [ ] Set up analytics
- [ ] Create billing FAQ
- [ ] Train support team
- [ ] Launch pricing page
- [ ] Announce to users

---

## 💰 Revenue Projections

### Conservative (100 users)
- 60 Free: $0
- 25 Starter: $725/month
- 12 Professional: $948/month
- 3 Enterprise: $897/month
- **Total: $2,570/month**

### Moderate (500 users)
- 250 Free: $0
- 150 Starter: $4,350/month
- 80 Professional: $6,320/month
- 20 Enterprise: $5,980/month
- **Total: $16,650/month**

### Optimistic (1,000 users)
- 400 Free: $0
- 350 Starter: $10,150/month
- 200 Professional: $15,800/month
- 50 Enterprise: $14,950/month
- **Total: $40,900/month**

---

**Last Updated**: 2026-01-20  
**Status**: Production-Ready  
**Stripe Integration**: Ready (needs API keys)  
**Feature Gating**: Complete
