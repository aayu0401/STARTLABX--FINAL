
import fs from 'fs';
import path from 'path';

// Use a file path that persists in the environment
const DB_PATH = path.join(process.cwd(), 'data.json');

interface DatabaseSchema {
    users: any[];
    posts: any[];
    communities: any[];
    messages: Record<string, any[]>;
    dashboardStats: any;
}

const INITIAL_DATA: DatabaseSchema = {
    users: [
        {
            id: 'user_1',
            name: 'Demo User',
            email: 'demo@example.com',
            title: 'Product Enthusiast',
            accountType: 'professional',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser'
        },
        {
            id: '1',
            name: 'Sarah Johnson',
            title: 'CEO @ GreenTech',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        }
    ],
    posts: [
        {
            id: '1',
            type: 'OPPORTUNITY',
            title: 'Looking for a Co-Founder!',
            content: 'We\'re building an AI-powered platform for sustainable agriculture. Looking for a technical co-founder with experience in ML/AI. Equity-based compensation. Let\'s change the world together! 🌱',
            hashtags: ['AI', 'Startup', 'CoFounder', 'Agriculture'],
            user: {
                id: '1',
                name: 'Sarah Johnson',
                title: 'CEO @ GreenTech',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
            },
            likesCount: 45,
            commentsCount: 12,
            sharesCount: 8,
            viewsCount: 234,
            isLiked: false,
            isSaved: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        }
    ],
    communities: [
        { id: '1', name: 'Tech Founders', members: 1200, category: 'Tech' },
        { id: '2', name: 'Design Ethos', members: 850, category: 'Design' },
    ],
    messages: {
        '1': [
            { id: 'm1', content: 'Hello!', senderId: '1', timestamp: new Date().toISOString(), type: 'text' }
        ]
    },
    dashboardStats: {
        matches: 12,
        connections: 45,
        communities: 8,
        activePosts: 3
    }
};

class JsonDatabase {
    private data: DatabaseSchema;

    constructor() {
        this.data = this.loadData();
    }

    private loadData(): DatabaseSchema {
        try {
            if (!fs.existsSync(DB_PATH)) {
                this.saveData(INITIAL_DATA);
                return INITIAL_DATA;
            }
            const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Failed to load database:', error);
            return INITIAL_DATA;
        }
    }

    private saveData(data: DatabaseSchema) {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Failed to save database:', error);
        }
    }

    get users() { return this.data.users; }
    get posts() {
        this.data = this.loadData();
        return this.data.posts;
    }
    get communities() { return this.data.communities; }
    get messages() { return this.data.messages; }
    get dashboardStats() { return this.data.dashboardStats; }

    addPost(post: any) {
        this.data = this.loadData();
        this.data.posts.unshift(post);
        this.saveData(this.data);
        return post;
    }

    addMessage(conversationId: string, message: any) {
        this.data = this.loadData();
        if (!this.data.messages[conversationId]) {
            this.data.messages[conversationId] = [];
        }
        this.data.messages[conversationId].push(message);
        this.saveData(this.data);
        return message;
    }
}

// Global singleton to prevent multiple instances in dev HMR
if (!(global as any).persistentDb) {
    (global as any).persistentDb = new JsonDatabase();
}

export const mockDb = (global as any).persistentDb as JsonDatabase;
