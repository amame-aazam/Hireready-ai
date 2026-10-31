import {
  AIProvider,
  ResumeAnalysisInput,
  ResumeAnalysisOutput,
  InterviewTurnInput,
  InterviewTurnOutput,
  InterviewEvaluationInput,
  InterviewEvaluationOutput,
} from './types';

// Domain keyword dictionaries for ATS scoring simulation
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  fullstack: [
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'REST',
    'Docker',
    'Redis',
    'Next.js',
    'Git',
    'CI/CD',
    'GraphQL',
    'Microservices',
    'Tailwind',
    'Jest',
  ],
  frontend: [
    'React',
    'TypeScript',
    'JavaScript',
    'CSS',
    'HTML5',
    'Tailwind',
    'Redux',
    'Next.js',
    'Webpack',
    'Vite',
    'Accessibility',
    'Performance',
    'Responsive Design',
    'Testing Library',
  ],
  backend: [
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Microservices',
    'REST APIs',
    'System Design',
    'Kafka',
    'RabbitMQ',
    'Kubernetes',
    'SQL Optimization',
    'Distributed Systems',
  ],
  'data-science': [
    'Python',
    'PyTorch',
    'TensorFlow',
    'Pandas',
    'NumPy',
    'Scikit-learn',
    'SQL',
    'Data Pipelines',
    'Feature Engineering',
    'MLOps',
    'Machine Learning',
    'Deep Learning',
    'Statistical Modeling',
  ],
};

const ACTION_VERBS = [
  'developed',
  'engineered',
  'built',
  'optimized',
  'architected',
  'designed',
  'reduced',
  'increased',
  'scaled',
  'automated',
  'implemented',
  'spearheaded',
  'refactored',
];

export class MockAIProvider implements AIProvider {
  public readonly name = 'MockAIProvider';

  private async simulateLatency(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
    await this.simulateLatency(350);

    const domainKey = (input.targetDomain || 'fullstack').toLowerCase().replace(/\s+/g, '-');
    const targetKeywords =
      DOMAIN_KEYWORDS[domainKey] || DOMAIN_KEYWORDS['fullstack'];

    const textLower = input.resumeText.toLowerCase();

    // 1. Identify present & missing keywords
    const presentKeywords: string[] = [];
    const missingKeywords: string[] = [];

    targetKeywords.forEach((kw) => {
      if (textLower.includes(kw.toLowerCase())) {
        presentKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    // 2. Pillar 1: Keyword Alignment (0 - 30)
    const keywordRatio = presentKeywords.length / targetKeywords.length;
    const keywordScore = Math.min(30, Math.round(keywordRatio * 28 + 2));

    // 3. Pillar 2: Action Verbs & Measurable Impact (0 - 30)
    let actionVerbCount = 0;
    ACTION_VERBS.forEach((verb) => {
      if (textLower.includes(verb)) actionVerbCount += 1;
    });
    const hasMetrics = /\d+[%kKmM]?|\bms\b|\bx\b/i.test(input.resumeText);
    const impactScore = Math.min(
      30,
      Math.round(Math.min(actionVerbCount, 5) * 4 + (hasMetrics ? 10 : 2))
    );

    // 4. Pillar 3: ATS Readability & Structure (0 - 20)
    const length = input.resumeText.length;
    let formattingScore = 14;
    if (length > 400 && length < 10000) formattingScore += 4;
    if (textLower.includes('experience') && textLower.includes('education')) formattingScore += 2;

    // 5. Pillar 4: Technical Skills Coverage (0 - 20)
    const skillsScore = Math.min(20, Math.round(presentKeywords.length * 2.2 + 4));

    const overallScore = Math.min(
      100,
      Math.max(35, keywordScore + impactScore + formattingScore + skillsScore)
    );

    // Contextual strengths & weaknesses
    const atsStrengths: string[] = [
      `Found ${presentKeywords.length} core technical competencies relevant to ${input.targetDomain || 'Software Engineering'}.`,
      actionVerbCount >= 3
        ? 'Effective usage of strong action verbs detailing past accomplishments.'
        : 'Clear chronological structure with recognizable section headings.',
      hasMetrics
        ? 'Includes quantifiable performance metrics demonstrating tangible business value.'
        : 'Good technical clarity in project descriptions.',
    ];

    const atsWeaknesses: string[] = [];
    if (missingKeywords.length > 0) {
      atsWeaknesses.push(
        `Missing high-frequency ATS keywords for this domain: ${missingKeywords.slice(0, 3).join(', ')}.`
      );
    }
    if (!hasMetrics) {
      atsWeaknesses.push(
        'Few or no quantifiable metrics (e.g. "reduced latency by 35%", "scaled to 10k users").'
      );
    }
    if (length < 800) {
      atsWeaknesses.push(
        'Resume content appears brief. Expand on technical architecture decisions and edge-case handling.'
      );
    }

    const suggestedImprovements: string[] = [
      `Incorporate key target domain technologies: ${missingKeywords.slice(0, 4).join(', ')}.`,
      'Adopt the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".',
      'Ensure standard ATS headings: "Technical Skills", "Work Experience", "Education", "Projects".',
    ];

    return {
      score: overallScore,
      scoreBreakdown: {
        keywordScore,
        impactScore,
        formattingScore,
        skillsScore,
      },
      atsStrengths,
      atsWeaknesses,
      missingKeywords,
      suggestedImprovements,
      extractedSkills: presentKeywords.length > 0 ? presentKeywords : ['Software Engineering', 'Git'],
    };
  }

  async generateInterviewTurn(input: InterviewTurnInput): Promise<InterviewTurnOutput> {
    await this.simulateLatency(300);

    const turnCount = input.dialogueHistory.length;

    if (input.interviewType === 'DSA') {
      if (turnCount === 0) {
        return {
          replyText:
            "Hello! Welcome to your technical interview. Let's start with a classic problem: Given an array of integers and a target sum, how would you find two numbers such that they add up to the target?",
          isTerminalTurn: false,
          suggestedFollowUp: 'Can you describe your brute-force vs optimal approach?',
        };
      }

      if (turnCount >= 6) {
        return {
          replyText:
            'Great job walking through the time and space complexity tradeoffs. That concludes our technical discussion for today! Do you have any questions for me?',
          isTerminalTurn: true,
        };
      }

      return {
        replyText:
          'That makes sense. Can you explain the space complexity of using a hash map here, and what happens in the case of duplicate elements?',
        isTerminalTurn: false,
        turnEvaluation: {
          clarity: 8.5,
          technicalAccuracy: 8.0,
        },
      };
    }

    // HR Interview
    if (turnCount === 0) {
      return {
        replyText:
          'Welcome! To kick things off, could you briefly introduce yourself and share a project you are particularly proud of?',
        isTerminalTurn: false,
      };
    }

    if (turnCount >= 6) {
      return {
        replyText:
          'Thank you for sharing your experiences and handling these situational questions thoughtfully. This wraps up our behavioral round!',
        isTerminalTurn: true,
      };
    }

    return {
      replyText:
        'Thank you for explaining that. Tell me about a time when you disagreed with a teammate on an architectural decision. How did you resolve it?',
      isTerminalTurn: false,
      turnEvaluation: {
        clarity: 9.0,
        technicalAccuracy: 8.5,
      },
    };
  }

  async evaluateInterview(input: InterviewEvaluationInput): Promise<InterviewEvaluationOutput> {
    await this.simulateLatency(400);

    const isDSA = input.interviewType === 'DSA';

    return {
      overallScore: isDSA ? 82 : 88,
      technicalScore: isDSA ? 84 : 80,
      communicationScore: 86,
      keyObservations: [
        'Articulated thought process before jumping into implementation.',
        'Good awareness of Big-O time and space complexity constraints.',
        'Listened attentively to feedback and adapted answers accordingly.',
      ],
      recommendation: 'HIRE',
      detailedFeedback: {
        strengths: [
          'Strong analytical thinking and structured communication.',
          'Understands hash-based data structures and edge case handling.',
        ],
        weaknesses: [
          'Could verify edge cases (e.g. empty inputs, integer overflow) more proactively.',
        ],
        technicalAnalysis:
          'Demonstrated solid algorithmic knowledge and correctly identified O(N) linear time optimization.',
        communicationAnalysis:
          'Clear, concise tone with structured STAR-method storytelling during behavioral queries.',
      },
    };
  }
}
