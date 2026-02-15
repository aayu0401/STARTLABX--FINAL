import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Clean up
    console.log('🧹 Cleaning up old data...');
    try {
        await prisma.notification.deleteMany();
        await prisma.subscription.deleteMany();
        await prisma.savedTalent.deleteMany();
        await prisma.savedPost.deleteMany();
        await prisma.like.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.communityPost.deleteMany();
        await prisma.communityMember.deleteMany();
        await prisma.community.deleteMany();
        await prisma.startup.deleteMany();
        await prisma.post.deleteMany();
    } catch (e) {
        console.warn('⚠️ Cleanup warning:', e);
    }

    // 2. Create demo users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            name: 'John Doe',
            password: hashedPassword,
            title: 'Full Stack Developer',
            bio: 'Passionate developer with 5+ years of experience in building scalable web applications.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            location: 'San Francisco, CA',
            accountType: 'professional',
            skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL']),
            experience: 5,
            availability: 'available',
            hourlyRate: 75,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'sarah@example.com' },
        update: {},
        create: {
            email: 'sarah@example.com',
            name: 'Sarah Johnson',
            password: hashedPassword,
            title: 'UI/UX Designer',
            bio: 'Creative designer specializing in user-centered design and brand identity.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            location: 'New York, NY',
            accountType: 'professional',
            skills: JSON.stringify(['Figma', 'Adobe XD', 'UI Design', 'Prototyping']),
            experience: 4,
            availability: 'available',
            hourlyRate: 65,
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: 'mike@example.com' },
        update: {},
        create: {
            email: 'mike@example.com',
            name: 'Mike Chen',
            password: hashedPassword,
            title: 'Product Manager',
            bio: 'Experienced PM focused on building products that users love.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            location: 'Austin, TX',
            accountType: 'startup',
            skills: JSON.stringify(['Product Strategy', 'Agile', 'User Research', 'Analytics']),
            experience: 6,
            availability: 'busy',
            hourlyRate: 85,
        },
    });

    console.log('✅ Created users');

    // 3. Create active subscription for main user
    await prisma.subscription.create({
        data: {
            userId: user1.id,
            plan: 'professional',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });

    // 4. Create demo posts
    const post1 = await prisma.post.create({
        data: {
            title: 'Excited to announce our new product launch!',
            content: 'After months of hard work, we\'re finally launching our AI-powered startup platform. Can\'t wait to see what the community builds with it! 🚀',
            type: 'ACHIEVEMENT',
            hashtags: JSON.stringify(['startup', 'AI', 'launch']),
            userId: user1.id,
            viewsCount: 1240,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'Looking for a talented React developer',
            content: 'We\'re hiring! Looking for a senior React developer to join our team. Must have experience with Next.js and TypeScript. DM if interested!',
            type: 'OPPORTUNITY',
            hashtags: JSON.stringify(['hiring', 'react', 'remote']),
            userId: user3.id,
            viewsCount: 850,
        },
    });

    const post3 = await prisma.post.create({
        data: {
            content: 'Just finished redesigning our entire dashboard. The new glassmorphism effects look amazing! What do you think about the trend? 🎨',
            type: 'INSIGHT',
            hashtags: JSON.stringify(['design', 'UI', 'glassmorphism']),
            userId: user2.id,
            viewsCount: 2100,
        },
    });

    // 5. Create demo likes
    await prisma.like.create({ data: { userId: user2.id, postId: post1.id } });
    await prisma.like.create({ data: { userId: user3.id, postId: post1.id } });
    await prisma.like.create({ data: { userId: user1.id, postId: post3.id } });

    // 6. Create demo comments
    await prisma.comment.create({
        data: { content: 'Congratulations! This looks amazing! 🎉', userId: user2.id, postId: post1.id },
    });
    await prisma.comment.create({
        data: { content: 'Great work! When can we try it out?', userId: user3.id, postId: post1.id },
    });

    // 7. Create demo startups
    const startup1 = await prisma.startup.create({
        data: {
            name: 'TechVenture AI',
            mission: 'Democratizing AI for everyone',
            description: 'Building accessible AI tools for small businesses and startups.',
            logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechVenture',
            website: 'https://techventure.ai',
            stage: 'Seed',
            location: 'San Francisco, CA',
            founderId: user1.id,
        },
    });

    const startup2 = await prisma.startup.create({
        data: {
            name: 'DesignHub',
            mission: 'Connecting designers with opportunities',
            description: 'A platform for designers to showcase work and find clients.',
            logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=DesignHub',
            website: 'https://designhub.io',
            stage: 'Series A',
            location: 'New York, NY',
            founderId: user2.id,
        },
    });

    // 8. Create demo communities
    const community1 = await prisma.community.create({
        data: {
            name: 'AI Enthusiasts',
            description: 'A community for AI developers and enthusiasts to share ideas and collaborate.',
            category: 'Technology',
            tags: JSON.stringify(['AI', 'Machine Learning', 'Deep Learning']),
            image: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            ownerId: user1.id,
        },
    });

    const community2 = await prisma.community.create({
        data: {
            name: 'Startup Founders',
            description: 'Connect with fellow founders, share experiences, and grow together.',
            category: 'Business',
            tags: JSON.stringify(['Startups', 'Entrepreneurship', 'Networking']),
            image: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            ownerId: user3.id,
        },
    });

    await prisma.communityMember.create({ data: { userId: user2.id, communityId: community1.id } });
    await prisma.communityMember.create({ data: { userId: user1.id, communityId: community2.id } });

    // 9. Create demo notifications
    // Unread
    await prisma.notification.create({
        data: {
            type: 'like',
            title: 'New Like',
            message: 'Sarah Johnson liked your post',
            userId: user1.id,
            isRead: false,
            metadata: JSON.stringify({ postId: post1.id, actorId: user2.id }),
        },
    });

    await prisma.notification.create({
        data: {
            type: 'comment',
            title: 'New Comment',
            message: 'Mike Chen commented on your post: "Great work!"',
            userId: user1.id,
            isRead: false,
            metadata: JSON.stringify({ postId: post1.id, actorId: user3.id }),
        },
    });

    // Read
    await prisma.notification.create({
        data: {
            type: 'system',
            title: 'Welcome',
            message: 'Welcome to StartLabX! Complete your profile to get started.',
            userId: user1.id,
            isRead: true,
        },
    });

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
