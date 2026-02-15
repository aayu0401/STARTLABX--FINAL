// Comprehensive Mock AI implementation for development
// This mock is compatible with Genkit's defineFlow and definePrompt patterns

export const ai = {
  defineFlow: (config: any, handler: any) => {
    // Return an async function that simulates the flow
    const flow = async (input: any) => {
      console.log(`[AI Flow Executing] ${config.name}`);
      try {
        return await handler(input);
      } catch (error) {
        console.error(`[AI Flow Error] ${config.name}:`, error);
        throw error;
      }
    };
    (flow as any).run = flow; // Some patterns use flow.run()
    return flow;
  },

  definePrompt: (config: any) => {
    // Return a function that simulates a prompt execution
    return async (input: any) => {
      console.log(`[AI Prompt Thinking] ${config.name}`);

      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      let mockOutput: any = {};

      if (config.name === 'startupDescriptionPrompt') {
        mockOutput = {
          description: `${input.startupName} is a disruptive force in the ${input.startupIndustry} sector. Driven by a mission to ${input.startupMission}, we are building a future where innovation meets scalability. Our solution bridges the gap between traditional industry constraints and next-generation efficiency.`
        };
      } else if (config.name === 'suggestTalentPrompt') {
        mockOutput = {
          talentSuggestions: [
            `Jordan Smith - Expert Engineering Lead with 8+ years experience.`,
            `Casey V. - UX/UI Architect specializing in high-growth SaaS environments.`,
            `Riley Chen - Go-to-Market specialist with deep ${input.equityExpectations} equity alignment.`
          ]
        };
      } else if (config.name === 'marketAnalysisPrompt') {
        mockOutput = {
          trends: ["Rise of decentralized infrastructure", "AI-first customer experience", "Sustainable supply chain management"],
          competitors: ["TechGiants Inc.", "OpenSource Pioneers", "Legacy Systems Corp"],
          riskScore: 24,
          summary: `The ${input.industry} market in ${input.location} is showing strong signals for disruption. High entry barriers exist, but the lack of localized AI solutions provides a significant moat for ${input.industry} startups.`
        };
      } else if (config.name === 'pitchDeckPrompt') {
        mockOutput = {
          slides: [
            { title: 'The Problem', bulletPoints: ['Inefficient legacy systems', 'High operational costs', 'Fragmented data silos'], imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b' },
            { title: 'Our Solution', bulletPoints: [`Introducing ${input.startupName}`, 'Unified AI workflow', 'Real-time analytics engine'], imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
            { title: 'Market Opportunity', bulletPoints: ['Total Addressable Market: $120B', 'Serviceable Available Market: $15B', 'Initial Target Market: $1.2B'], imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f' },
            { title: 'Business Model', bulletPoints: ['Tiered SaaS Subscription', 'Enterprise Licensing', 'Transaction Fees (2%)'], imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' },
            { title: 'Growth Strategy', bulletPoints: ['Direct Sales to Enterprise', 'Developer Community Growth', 'Strategic Partnerships'], imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c' }
          ]
        };
      } else if (config.name === 'vcSimulationPrompt') {
        const isPositive = Math.random() > 0.4; // 60% chance of positive outcome
        mockOutput = {
          investorPersona: "Sarah Sterling - Partner at Horizon Ventures",
          decision: isPositive ? 'Meeting' : 'Reject',
          feedback: isPositive
            ? `I'm intrigued by the ${input.startupName} proposition. The approach to ${input.stage} growth is aggressive but plausible. I'd like to dig deeper into your unit economics.`
            : `While ${input.startupName} is an interesting concept, I don't see a clear path to $100M ARR within our timeline. The market feels too fragmented.`,
          score: isPositive ? 88 : 62,
          keyConcerns: ["Competitive Moat", "Go-to-Market Velocity", "Team Experience"],
          termSheetOffer: isPositive && Math.random() > 0.7 ? "$2M Investment at $15M Post-Money Valuation" : undefined
        };
      } else if (config.name === 'roadmapPrompt') {
        mockOutput = {
          phases: [
            {
              name: "Phase 1: Foundation (Weeks 1-4)",
              milestones: [
                { week: 1, title: "Core Architecture Setup", type: "tech", description: "Setup Next.js, Prisma, and Auth." },
                { week: 2, title: "Legal Incorporation", type: "legal", description: "File Delaware C-Corp and set up banking." },
                { week: 3, title: "Brand Identity", type: "marketing", description: "Finalize logo, colors, and landing page copy." },
                { week: 4, title: "MVP Prototype", type: "tech", description: "Core feature loop implementation." }
              ]
            },
            {
              name: "Phase 2: Traction (Weeks 5-8)",
              milestones: [
                { week: 5, title: "Private Alpha Launch", type: "product", description: "Onboard first 10 friendly users." },
                { week: 6, title: "Waitlist Viral Campaign", type: "marketing", description: "Launch referral system on Twitter/LinkedIn." },
                { week: 8, title: "First Revenue", type: "business", description: "Close first 3 paid pilot contracts." }
              ]
            },
            {
              name: "Phase 3: Scale (Weeks 9-12)",
              milestones: [
                { week: 9, title: "Series A Deck Prep", type: "fundraising", description: "Consolidate metrics and narrative." },
                { week: 10, title: "Key Hires", type: "hiring", description: "Hire Founding Engineer and Marketing Lead." },
                { week: 12, title: "Public Beta", type: "product", description: "Open access to waitlist (1k+ users)." }
              ]
            }
          ]
        };
      } else if (config.name === 'legalPrompt') {
        const { docType, partyA, partyB } = input;
        mockOutput = {
          content: `**${docType.toUpperCase()}**\n\nThis Agreement is entered into by and between **${partyA}** ("Disclosing Party") and **${partyB}** ("Receiving Party").\n\n**1. CONFIDENTIAL INFORMATION**\nThe Receiving Party understands that the Disclosing Party has disclosed or may disclose information relating to the Disclosing Party's business, which to the extent previously, presently, or subsequently disclosed to the Receiving Party is hereinafter referred to as "Proprietary Information" of the Disclosing Party.\n\n**2. OBLIGATIONS**\nThe Receiving Party agrees: (i) to hold the Proprietary Information in strict confidence and to take all reasonable precautions to protect such Proprietary Information, (ii) not to divulge any such Proprietary Information or any information derived from it to any third person.\n\n**3. JURISDICTION**\nThis Agreement shall be governed by the laws of Delaware.\n\n**IN WITNESS WHEREOF**, the parties have executed this Agreement.\n\n__________________\n${partyA}\n\n__________________\n${partyB}`,
          validityFields: ["Jurisdiction", "Term"]
        };
      } else {
        mockOutput = { result: "AI Generated content based on " + JSON.stringify(input) };
      }

      return {
        output: mockOutput,
        text: () => JSON.stringify(mockOutput)
      };
    };
  },

  generate: async (config: any) => {
    console.log(`[AI Generate] ${JSON.stringify(config)}`);
    return {
      text: () => "I'm Cortex. I can help you navigate the app or analyze your startup data."
    };
  }
};

export default ai;
