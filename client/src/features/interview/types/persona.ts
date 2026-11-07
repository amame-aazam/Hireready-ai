export type PersonaDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Behavioral';

export interface Persona {
  key: string;
  id: string;
  name: string;
  role: string;
  difficulty: PersonaDifficulty;
  tier: 'Warm-up' | 'Real round' | 'Bar-raiser' | 'Behavioral';
  difficultyTier: string;
  tagline: string;
  quote: string;
  description: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  targetAudience: string;
  approachStrictness: 'lenient' | 'moderate' | 'strict';
  hintFrequency: 'frequent' | 'on_request' | 'rare';
}

export type InterviewerPersona = Persona;

export const PERSONAS: Persona[] = [
  {
    key: 'arjun',
    id: 'arjun',
    name: 'Arjun',
    role: 'Software Engineer',
    difficulty: 'Easy',
    tier: 'Warm-up',
    difficultyTier: 'Warm-up',
    tagline: 'Friendly and patient. A good first interview.',
    quote: 'Friendly and patient. A good first interview.',
    description: 'Encouraging style. Helps you get unstuck quickly with gentle hints and accepts progressive optimizations.',
    accentColor: '#10B981',
    accentBg: '#ECFDF5',
    accentBorder: '#A7F3D0',
    targetAudience: 'Software developers',
    approachStrictness: 'lenient',
    hintFrequency: 'frequent',
  },
  {
    key: 'tanya',
    id: 'tanya',
    name: 'Tanya',
    role: 'Member of Technical Staff',
    difficulty: 'Easy',
    tier: 'Warm-up',
    difficultyTier: 'Warm-up',
    tagline: 'Brute force is fine to start. Hints when you stall.',
    quote: 'Brute force is fine to start. Hints when you stall.',
    description: 'Allows you to walk through a naive solution first, then guides you step-by-step toward optimal runtime.',
    accentColor: '#06B6D4',
    accentBg: '#ECFEFF',
    accentBorder: '#A5F3FC',
    targetAudience: 'Software developers',
    approachStrictness: 'lenient',
    hintFrequency: 'frequent',
  },
  {
    key: 'samarth',
    id: 'samarth',
    name: 'Samarth',
    role: 'Senior Software Engineer',
    difficulty: 'Medium',
    tier: 'Real round',
    difficultyTier: 'Real round',
    tagline: 'A real company round. Wants specifics, not claims.',
    quote: 'A real company round. Wants specifics, not claims.',
    description: 'Simulates a Tier-1 tech interview. Drills down on space/time trade-offs and expects concrete complexity analysis.',
    accentColor: '#3B82F6',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    targetAudience: 'Senior engineers',
    approachStrictness: 'moderate',
    hintFrequency: 'on_request',
  },
  {
    key: 'riddhi',
    id: 'riddhi',
    name: 'Riddhi',
    role: 'Tech Lead',
    difficulty: 'Medium',
    tier: 'Real round',
    difficultyTier: 'Real round',
    tagline: 'Cross-questions every choice you make.',
    quote: 'Cross-questions every choice you make.',
    description: 'Challenges your algorithmic assumptions and pushes you to justify data structures and design choices.',
    accentColor: '#8B5CF6',
    accentBg: '#F5F3FF',
    accentBorder: '#DDD6FE',
    targetAudience: 'Senior engineers',
    approachStrictness: 'moderate',
    hintFrequency: 'on_request',
  },
  {
    key: 'vivan',
    id: 'vivan',
    name: 'Vivan',
    role: 'Principal Engineer',
    difficulty: 'Hard',
    tier: 'Bar-raiser',
    difficultyTier: 'Bar-raiser',
    tagline: 'Top-company bar. Optimal approach before any code.',
    quote: 'Top-company bar. Optimal approach before any code.',
    description: 'Demands an optimal O(N) or sub-quadratic approach before writing a single line of code. No shortcuts.',
    accentColor: '#F59E0B',
    accentBg: '#FFFBEB',
    accentBorder: '#FDE68A',
    targetAudience: 'Staff+ engineers',
    approachStrictness: 'strict',
    hintFrequency: 'rare',
  },
  {
    key: 'shreya',
    id: 'shreya',
    name: 'Shreya',
    role: 'Bar Raiser & Staff Architect',
    difficulty: 'Hard',
    tier: 'Bar-raiser',
    difficultyTier: 'Bar-raiser',
    tagline: 'Asks for the edge case you missed. Rarely hints.',
    quote: 'Asks for the edge case you missed. Rarely hints.',
    description: 'Strict evaluation targeting empty inputs, numeric overflows, cyclic states, and extreme boundary tests.',
    accentColor: '#E11D48',
    accentBg: '#FFF1F2',
    accentBorder: '#FECDD3',
    targetAudience: 'Staff+ engineers',
    approachStrictness: 'strict',
    hintFrequency: 'rare',
  },
  {
    key: 'kavya',
    id: 'kavya',
    name: 'Kavya',
    role: 'Senior Talent Partner',
    difficulty: 'Behavioral',
    tier: 'Behavioral',
    difficultyTier: 'Behavioral',
    tagline: 'Real stories, warmly asked, never let go vague.',
    quote: 'Real stories, warmly asked, never let go vague.',
    description: 'Evaluates behavioral competency through the STAR method. Probes for specific personal actions and quantified outcomes.',
    accentColor: '#FF7A48',
    accentBg: '#FFF5F0',
    accentBorder: '#FFD7C5',
    targetAudience: 'All engineering levels',
    approachStrictness: 'strict',
    hintFrequency: 'on_request',
  },
];

export const INTERVIEWER_PERSONAS = PERSONAS;

export const TECHNICAL_PERSONAS = PERSONAS.filter((p) => p.difficulty !== 'Behavioral');
export const BEHAVIORAL_PERSONA = PERSONAS.find((p) => p.key === 'kavya') || PERSONAS[6];

export const getPersonaByKey = (key?: string): Persona => {
  return PERSONAS.find((p) => p.key === key?.toLowerCase() || p.id === key?.toLowerCase()) || PERSONAS[0];
};
