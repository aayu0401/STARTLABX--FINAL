import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = process.env.GOOGLE_GENAI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)
    : null;

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const project = await prisma.startupProject.findFirst({
            where: { userId: user.id },
            include: {
                traction: true,
                dailyActions: { orderBy: { date: 'desc' }, take: 5 },
                milestones: { where: { status: 'in_progress' } }
            }
        });

        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        // AI Board Meeting Logic
        let aiFeedback: string = "AI Configuration Missing. Please add GOOGLE_GENAI_API_KEY.";
        let sentiment: string = "neutral";

        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const tractionScore = project.traction?.score || 0;
                const recentActions = project.dailyActions.map(a => a.content).join(', ') || "None";
                const milestones = project.milestones.map(m => m.title).join(', ') || "None";

                const prompt = `
                    Act as a brutal but fair Startup Board Member. 
                    Analyze this weekly update:
                    - Traction Score: ${tractionScore}
                    - Recent Actions: ${recentActions}
                    - Current Milestones: ${milestones}
                    
                    Provide 1 paragraph of strategic feedback and 1 paragraph of tactical advice.
                    Be concise. No fluff.
                `;

                const result = await model.generateContent(prompt);
                const response = result.response;
                aiFeedback = response.text();

                // Simple Sentiment Logic
                sentiment = tractionScore > 60 ? "optimistic" : (tractionScore > 30 ? "neutral" : "concerned");

            } catch (aiError) {
                console.error("AI Generation Failed:", aiError);
                aiFeedback = "AI Board Member offline. Focus on core metrics.";
            }
        }

        // Save Board Meeting Record
        const meeting = await prisma.boardMeeting.create({
            data: {
                projectId: project.id,
                date: new Date(),
                weekNumber: getWeekNumber(new Date()),
                status: 'completed',
                sentiment: sentiment,
                aiFeedback: aiFeedback
            }
        });

        return NextResponse.json(meeting);

    } catch (error) {
        console.error("Board Meeting Failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
