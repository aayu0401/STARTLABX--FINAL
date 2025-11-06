export type EquityLevel = 'Low' | 'Medium' | 'High' | 'Low-Medium' | 'Medium-High';
export type Availability = 'Freelance' | 'Equity' | 'Freelance/Equity' | 'Co-founder';

export interface Talent {
  name: string;
  avatar: string;
  dataAiHint: string;
  title: string;
  skills: string[];
  equity: EquityLevel;
  availability: Availability;
}
