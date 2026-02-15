import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptors disabled for debugging
// Interceptors
apiClient.interceptors.request.use(async (config) => {
  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // GLOBAL DEMO OFFLINE MODE INTERCEPTOR
      // If we are in demo offline mode, short-circuit the network request
      if (token.startsWith('demo-offline-token-')) {
        console.debug(`[Demo Mode] Intercepting request to ${config.url}`);

        // We need to reject the axios request but return a custom object that 
        // looks like a successful response. However, axios interceptors expect to return config.
        // To mock the response, we actually need to throw a special error or use an adapter.
        // The cleanest way in axios is to set an adapter for this specific request.
        config.adapter = async (requestConfig) => {
          const mockData = getMockData(requestConfig.url || '', requestConfig.method || 'get', requestConfig.data);

          // Simulate network delay for realism
          await new Promise(r => setTimeout(r, 600));

          return {
            data: mockData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: requestConfig,
            request: {}
          };
        };
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper function to generate mock data based on URL
function getMockData(url: string, method: string, data: any): any {
  // URL routing logic for mocks
  if (url.includes('/api/dashboard')) {
    return {
      stats: {
        totalViews: 12543,
        viewsChange: 12.5,
        engagementRate: 5.4,
        engagementChange: 2.1,
        newFollowers: 342,
        followersChange: 8.4,
        totalInteractions: 892,
        interactionsChange: 15.2
      },
      engagementData: [
        { date: 'Mon', views: 1200, likes: 120, comments: 45, shares: 12 },
        { date: 'Tue', views: 1800, likes: 160, comments: 55, shares: 20 },
        { date: 'Wed', views: 2400, likes: 200, comments: 80, shares: 35 },
        { date: 'Thu', views: 2100, likes: 180, comments: 60, shares: 25 },
        { date: 'Fri', views: 3200, likes: 280, comments: 95, shares: 45 },
        { date: 'Sat', views: 2800, likes: 240, comments: 85, shares: 40 },
        { date: 'Sun', views: 2600, likes: 210, comments: 70, shares: 30 },
      ],
      audienceBreakdown: [
        { profession: 'Founders', percentage: 45, count: 450 },
        { profession: 'Investors', percentage: 20, count: 200 },
        { profession: 'Developers', percentage: 35, count: 350 },
      ],
      topPosts: [
        { id: '1', content: 'Just launched our MVP!', views: 5000, likes: 400, comments: 50, shares: 20, engagement: 8.5, createdAt: new Date().toISOString() },
      ],
      growthInsights: [],
      activitySummary: { posts: 5, comments: 20, likes: 100, shares: 15, connections: 10, messages: 5 },
      recommendedActions: []
    };
  }

  if (url.includes('/api/projects')) {
    if (url.includes('/boards')) {
      return [
        { id: 'b1', name: 'Product Roadmap', columns: [] },
        { id: 'b2', name: 'Marketing Launch', columns: [] }
      ];
    }
    return {
      projects: [
        { id: '1', name: 'AI Core Engine', status: 'active', progress: 75, teamMembers: [], description: 'Main backend logic for AI processing.' },
        { id: '2', name: 'Mobile App V1', status: 'planning', progress: 10, teamMembers: [], description: 'iOS and Android client application.' }
      ],
      total: 2
    };
  }

  if (url.includes('/api/communities')) {
    return {
      communities: [
        { id: '1', name: 'SaaS Founders', memberCount: 1200, category: 'SaaS', description: 'Community for SaaS entrepreneurs.' },
        { id: '2', name: 'AI Devs', memberCount: 850, category: 'Tech', description: 'Discussions about LLMs and agents.' }
      ],
      total: 2
    };
  }

  if (url.includes('/api/startups')) {
    return {
      startups: [
        { id: '1', name: 'Nebula AI', industry: 'AI', stage: 'Seed', fundingRaised: 1500000, description: 'AI infrastructure for everyone.' },
        { id: '2', name: 'GreenTech', industry: 'Cleantech', stage: 'Series A', fundingRaised: 5000000, description: 'Sustainable energy solutions.' }
      ],
      total: 2
    };
  }

  if (url.includes('/api/talent')) {
    return {
      professionals: [
        { id: '1', name: 'Sarah Chen', title: 'Senior Developer', skills: ['React', 'Node.js', 'Python'], location: 'San Francisco' },
        { id: '2', name: 'Mike Ross', title: 'Product Designer', skills: ['Figma', 'UI/UX', 'Product Strategy'], location: 'New York' }
      ],
      total: 2
    };
  }

  if (url.includes('/api/users/me')) {
    return {
      id: 'demo-user',
      name: 'Demo Founder',
      email: 'demo@startlabx.com',
      accountType: 'startup',
      title: 'CEO & Founder',
      companyName: 'Future Inc.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      bio: 'Testing out the platform in offline demo mode.'
    };
  }

  if (url.includes('/api/ai/validate-idea')) {
    return {
      analysis: {
        overallScore: 85,
        marketPotential: 90,
        feasibility: 80,
        uniqueness: 75,
        competitionLevel: 60
      },
      insights: ['Strong market demand identified.', 'Technical complexity is moderate.'],
      recommendations: ['Focus on MVP first.', 'Validate with paid ads.'],
      risks: ['High competition in this niche.'],
      opportunities: ['Partnership potential with existing tech giants.'],
      nextSteps: ['Build landing page', 'Interview 10 potential customers']
    };
  }

  if (url.includes('/api/notifications')) {
    return {
      notifications: [
        { id: '1', title: 'Welcome', message: 'Welcome to the demo!', type: 'system', read: false, createdAt: new Date().toISOString() }
      ],
      unreadCount: 1
    };
  }

  // Default generic mock for writes or unknowns
  if (method !== 'get') {
    return { success: true, id: 'mock-id-' + Date.now(), message: 'Action completed in demo mode' };
  }

  return { data: [], message: 'Mock data for ' + url };
}

export default apiClient;
