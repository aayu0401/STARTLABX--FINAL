
// Simple in-memory mock database
// In a real production app, this would be a real database connection (Postgres, Mongo, etc.)

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // stored essentially in plain text for this mock (hashed in reality)
    accountType: 'startup' | 'professional';
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    skills?: string[];
    title?: string;
    companyName?: string;
    industry?: string;
}

// Initial mock data
const users: User[] = [
    {
        id: 'user_1',
        name: 'Demo Founder',
        email: 'founder@example.com',
        password: 'password123',
        accountType: 'startup',
        companyName: 'Future Tech',
        industry: 'AI',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    {
        id: 'user_2',
        name: 'Demo Talent',
        email: 'talent@example.com',
        password: 'password123',
        accountType: 'professional',
        title: 'Senior Developer',
        skills: ['React', 'Node.js', 'Typescript'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    }
];

export const db = {
    users: {
        findUnique: async (query: { email: string }) => {
            return users.find((u) => u.email === query.email) || null;
        },
        create: async (data: Omit<User, 'id'>) => {
            const newUser = { ...data, id: `user_${Date.now()}` };
            users.push(newUser);
            return newUser;
        },
        findById: async (id: string) => {
            return users.find((u) => u.id === id) || null;
        }
    },
};
