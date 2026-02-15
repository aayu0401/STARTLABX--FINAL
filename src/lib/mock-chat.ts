
// Mock data for messages
export const conversations = [
    {
        id: '1',
        user: {
            id: '1',
            name: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
            title: 'Product Designer @ TechCorp',
            online: true,
        },
        lastMessage: {
            content: 'That sounds great! When can we schedule a call?',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            read: false,
            fromMe: false,
        },
        unreadCount: 2,
    },
    {
        id: '2',
        user: {
            id: '2',
            name: 'Alex Kumar',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexKumar',
            title: 'Full Stack Developer',
            online: true,
        },
        lastMessage: {
            content: 'Thanks for the opportunity!',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: true,
            fromMe: true,
        },
        unreadCount: 0,
    },
];

export const messages = {
    '1': [
        {
            id: '1',
            content: 'Hey! I saw your post about looking for a co-founder',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            fromMe: false,
            read: true,
            type: 'text',
        },
        {
            id: '2',
            content: 'Hi! Yes, we\'re actively looking for someone with your background',
            timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
            fromMe: true,
            read: true,
            type: 'text',
        },
    ] as any[],
};
