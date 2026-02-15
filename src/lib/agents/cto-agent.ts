
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';

export class CtoAgent extends BaseAgent {
    role = 'CTO' as const;
    name = 'Tech Architect';
    description = 'Designs the system architecture and selects the tech stack.';

    async process(context: AgentContext): Promise<AgentResult> {
        const { strategy, features } = context.input;
        const project = context.project;

        let stack: any;
        let architectureDiagram: string;
        let prismaSchema: string;

        try {
            const stackPrompt = `Design a tech stack for a startup named "${project.name}" with strategy "${strategy}".
            Provide JSON output for keys: frontend, backend, database, ai, auth.`;
            stack = await LlmService.generateJSON(stackPrompt, 'Tech Stack Object');

            const diagramPrompt = `Generate a Mermaid JS diagram code (graph TD) for the system architecture of "${project.name}". 
            Include User, Frontend, Backend, Database, AI Service. 
            Output ONLY the mermaid code.`;
            architectureDiagram = await LlmService.generate(diagramPrompt);
            architectureDiagram = architectureDiagram.replace(/```mermaid/g, '').replace(/```/g, '').trim();

            const schemaPrompt = `Generate a Prisma Schema (schema.prisma) for "${project.name}".
            Include models for User, Subscription, and core entities related to the startup idea.
            Output ONLY the prisma code.`;
            prismaSchema = await LlmService.generate(schemaPrompt);
            prismaSchema = prismaSchema.replace(/```prisma/g, '').replace(/```/g, '').trim();

        } catch (e) {
            console.warn('Real AI failed, falling back to simulation logic.', e);

            // Simulate LLM thinking delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            stack = {
                frontend: "Next.js 15 (App Router)",
                backend: "Serverless Functions (Vercel)",
                database: "PostgreSQL with Prisma ORM",
                ai: "OpenAI GPT-4o + Vector DB (Pinecone)",
                auth: "Clerk or NextAuth"
            };

            architectureDiagram = `
graph TD
    User((User)) -->|HTTPS| CDN[Edge CDN]
    CDN -->|Next.js| FE[Frontend App]
    FE -->|API Routes| BE[Backend API]
    BE -->|Query| DB[(PostgreSQL)]
    BE -->|Vector Search| VDB[(Pinecone)]
    BE -->|LLM Calls| AI[OpenAI API]
    
    subgraph "Data Layer"
    DB
    VDB
    end
    
    subgraph "Services"
    Auth[Authentication]
    Pay[Stripe Billing]
    end
    
    FE --> Auth
    BE --> Pay
`;

            prismaSchema = `
// Generated Schema for ${project.name}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      String   @default("user")
  createdAt DateTime @default(now())
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  ownerId   String
}
// Add more models based on features...
`;
        }

        return {
            success: true,
            output: { stack },
            artifacts: [
                {
                    title: 'System_Architecture.mermaid',
                    type: 'diagram',
                    content: architectureDiagram,
                    format: 'mermaid'
                },
                {
                    title: 'schema.prisma',
                    type: 'code',
                    content: prismaSchema,
                    format: 'prisma'
                }
            ],
            nextSteps: [
                {
                    role: 'frontend_dev',
                    action: 'scaffold_project',
                    input: { stack }
                }
            ]
        };
    }
}
