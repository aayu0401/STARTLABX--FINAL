
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';

export class MarketingAgent extends BaseAgent {
    role = 'growth_hacker' as const; // Using existing 'growth_hacker' role or map to CMO
    name = 'CMO';
    description = 'Generates marketing strategies, social media content, and branding.';

    async process(context: AgentContext): Promise<AgentResult> {
        const { project } = context;
        const input = context.input || {};

        // We'll trust the CEO's strategy if available, otherwise assume generic
        const strategyContext = input.strategy ? JSON.stringify(input.strategy) : 'General SaaS Growth';

        let marketingPlan: string;
        let socialPosts: any;

        try {
            const planPrompt = `
            Act as a Chief Marketing Officer for a startup named "${project.name}".
            Idea: "${project.description}".
            Strategy Context: ${strategyContext}.

            Create a comprehensive Marketing Strategy (Markdown).
            Include:
            1. Value Proposition & Tagline
            2. Target Personas (Demographics, Pain Points)
            3. Channels (SEO, Social, Content, Paid)
            4. Launch Campaign Ideas (Pre-launch, Launch Day, Post-launch)
            5. Key Metrics (KPIs) to track.
            `;

            marketingPlan = await LlmService.generate(planPrompt);

            // Also generate some social media posts as JSON
            const socialPrompt = `
            Generate 5 engaging social media posts (Twitter/LinkedIn) to announce the launch of "${project.name}".
            Output JSON array of objects with keys: "platform", "content", "hashtags".
            `;
            socialPosts = await LlmService.generateJSON(socialPrompt, 'Array of Social Media Posts');

        } catch (e) {
            console.warn('Real AI failed, falling back to simulation logic.', e);

            // Simulate thinking
            await new Promise(resolve => setTimeout(resolve, 2000));

            marketingPlan = `
# Marketing Strategy for ${project.name}

## 1. Value Proposition
**Tagline**: "The Future of ${project.description.split(' ')[0]} is Here."
**Core Value**: Empowering users to achieve more with AI-driven automation.

## 2. Target Personas
- **Innovators**: Tech-savvy early adopters looking for an edge.
- **Enterprise Leads**: Managers seeking efficiency at scale.

## 3. Channels
- **SEO**: Target high-intent keywords related to "${project.description.split(' ')[0]}".
- **Content**: Publish whitepapers and case studies.
- **Social**: LinkedIn for B2B, Twitter for Tech.

## 4. Launch Campaign
- **Week 1**: Teaser campaign "Something Big is Coming".
- **Week 2**: Product Hunt Launch.
- **Week 3**: Webinar / Live Demo.

## 5. KPIs
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- Monthly Active Users (MAU)
`;

            socialPosts = [
                { platform: "Twitter", content: `🚀 Exciting news! We are building ${project.name} to revolutionize the industry. #Startup #AI`, hashtags: ["#BuildInPublic"] },
                { platform: "LinkedIn", content: `We are thrilled to announce ${project.name}, a new solution for...`, hashtags: ["#SaaS", "#Launch"] }
            ];
        }

        return {
            success: true,
            output: { socialPosts },
            artifacts: [
                {
                    title: 'Marketing_Strategy.md',
                    type: 'document',
                    content: marketingPlan,
                    format: 'markdown'
                },
                {
                    title: 'Social_Media_Kit.json',
                    type: 'code', // Display as JSON code
                    content: JSON.stringify(socialPosts, null, 2),
                    format: 'json'
                }
            ]
        };
    }
}
