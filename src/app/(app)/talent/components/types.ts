export interface Talent {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  skills: string[];
  availability?: string;
  hourlyRate?: number;
  bio?: string;
  location?: string;
  dataAiHint?: string;
  equity?: string; // Legacy mock field
}
