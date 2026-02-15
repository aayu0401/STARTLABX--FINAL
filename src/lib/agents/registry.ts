
import { BaseAgent, AgentRole } from './base-agent';
import { CeoAgent } from './ceo-agent';
import { CtoAgent } from './cto-agent';
import { FrontendAgent } from './frontend-agent';
import { MarketingAgent } from './marketing-agent';
import { LegalAgent } from './legal-agent';
import { PmAgent } from './pm-agent';

// Map of roles to Agent instances
const agentMap: Record<string, BaseAgent> = {
    'CEO': new CeoAgent(),
    'CTO': new CtoAgent(),
    'PM': new PmAgent(),
    'frontend_dev': new FrontendAgent(),
    'growth_hacker': new MarketingAgent(),
    'legal_bot': new LegalAgent(),
    // Add more agents...
};

/**
 * Get an agent instance by role.
 */
export function getAgent(role: AgentRole | string): BaseAgent {
    const agent = agentMap[role];
    if (!agent) {
        throw new Error(`Agent with role ${role} not found.`);
    }
    return agent;
}

/**
 * List all available agents
 */
export function getAvailableAgents() {
    return Object.values(agentMap).map(agent => ({
        role: agent.role,
        name: agent.name,
        description: agent.description
    }));
}
