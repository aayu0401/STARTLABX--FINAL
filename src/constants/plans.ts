
export const PLANS = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for individual founders and early ideation.',
        price: 0,
        interval: 'month',
        popular: false,
        features: [
            '10 AI Credits per month',
            '1 Active Pitch Deck',
            'Basic Startup Profile',
            'Community Support'
        ],
        limits: {
            aiCredits: 10,
            pitchDecks: 1,
            mvpPlans: 1,
            contracts: 0,
            teamMembers: 1,
            storage: 1,
            prioritySupport: false,
            customBranding: false,
            apiAccess: false
        }
    },
    {
        id: 'starter',
        name: 'Starter',
        description: 'For serioius builders launching their first MVP.',
        price: 29,
        interval: 'month',
        popular: true,
        features: [
            '100 AI Credits per month',
            '3 Active Pitch Decks',
            'MVP Roadmap Builder',
            'Email Support'
        ],
        limits: {
            aiCredits: 100,
            pitchDecks: 3,
            mvpPlans: 3,
            contracts: 5,
            teamMembers: 2,
            storage: 5,
            prioritySupport: false,
            customBranding: false,
            apiAccess: false
        }
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Scale your venture with advanced AI and collaboration.',
        price: 99,
        interval: 'month',
        popular: false,
        features: [
            '500 AI Credits per month',
            'Unlimited Pitch Decks',
            'Team Collaboration',
            'Priority Support',
            'Custom Branding'
        ],
        limits: {
            aiCredits: 500,
            pitchDecks: -1, // Unlimited
            mvpPlans: -1,
            contracts: -1,
            teamMembers: 5,
            storage: 20,
            prioritySupport: true,
            customBranding: true,
            apiAccess: true
        }
    },
    {
        id: 'founder',
        name: 'Founder',
        description: 'AI Co-founder Access. Build your startup with autonomous agents.',
        price: 299,
        interval: 'month',
        popular: true,
        features: [
            'Full Access to AI Incubator',
            'Unlimited AI Credits',
            '10 Active Projects',
            'Agent Squad (CEO, CTO, PM)',
            'Auto-generated Code & Docs'
        ],
        limits: {
            aiCredits: -1,
            pitchDecks: -1,
            mvpPlans: -1,
            contracts: -1,
            teamMembers: 10,
            storage: 100,
            prioritySupport: true,
            customBranding: true,
            apiAccess: true
        }
    },
    {
        id: 'unicorn',
        name: 'Unicorn',
        description: 'Enterprise-grade ecosystem for serial founders and VCs.',
        price: 999,
        interval: 'month',
        popular: false,
        features: [
            'Unlimited Everything',
            'Dedicated Human Success Manager',
            'Private Cloud Deployment',
            'Custom Agent Training',
            'Legal & Finance Concierge'
        ],
        limits: {
            aiCredits: -1,
            pitchDecks: -1,
            mvpPlans: -1,
            contracts: -1,
            teamMembers: -1,
            storage: 1000,
            prioritySupport: true,
            customBranding: true,
            apiAccess: true
        }
    }
];
