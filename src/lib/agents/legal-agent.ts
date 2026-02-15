
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';

export class LegalAgent extends BaseAgent {
    role = 'legal_bot' as const;
    name = 'General Counsel';
    description = 'Drafts legal documents, privacy policies, and terms of service.';

    async process(context: AgentContext): Promise<AgentResult> {
        const { project } = context;

        let privacyPolicy: string;
        let termsOfService: string;

        try {
            const privacyPrompt = `
            Draft a standard GDPR-compliant Privacy Policy (Markdown) for a SaaS startup named "${project.name}".
            Briefly cover: Data Collection, Usage, Cookies, User Rights, and Contact Info.
            Keep it professional but concise for an MVP.
            `;
            privacyPolicy = await LlmService.generate(privacyPrompt);

            const termsPrompt = `
            Draft standard Terms of Service (Markdown) for "${project.name}".
            Cover: Acceptance of Terms, User Accounts, Intellectual Property, Limitation of Liability, and Termination.
            `;
            termsOfService = await LlmService.generate(termsPrompt);

        } catch (e) {
            console.warn('Real AI failed, falling back to simulation logic.', e);

            // Simulate thinking
            await new Promise(resolve => setTimeout(resolve, 2000));

            privacyPolicy = `
# Privacy Policy for ${project.name}

**Last Updated**: ${new Date().toLocaleDateString()}

## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.

## 2. How We Use Information
We use the information we collect to provide, maintain, and improve our services, including to process transactions and send you related information.

## 3. Cookies
We use cookies to collect information about your activity on our services.

## 4. Contact Us
If you have any questions about this Privacy Policy, please contact us at support@${project.name.toLowerCase().replace(/\s/g, '')}.com.
`;

            termsOfService = `
# Terms of Service for ${project.name}

## 1. Acceptance of Terms
By accessing or using our services, you agree to be bound by these Terms.

## 2. User Accounts
You are responsible for safeguarding your account login credentials.

## 3. Usage Limits
You agree not to misuse our services or help anyone else do so.

## 4. Termination
We may terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever.
`;
        }

        return {
            success: true,
            output: { docsGenerated: ['Privacy Policy', 'Terms of Service'] },
            artifacts: [
                {
                    title: 'Privacy_Policy.md',
                    type: 'document',
                    content: privacyPolicy,
                    format: 'markdown'
                },
                {
                    title: 'Terms_of_Service.md',
                    type: 'document',
                    content: termsOfService,
                    format: 'markdown'
                }
            ]
        };
    }
}
