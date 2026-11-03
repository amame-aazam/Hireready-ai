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
    await this.simulateLatency(250);

    const turnCount = input.dialogueHistory.length;
    const utterance = (input.latestCandidateUtterance || '').toLowerCase();
    const code = (input.codeSnippet || '').toLowerCase();

    if (input.interviewType === 'DSA') {
      if (turnCount === 0) {
        return {
          replyText:
            "Hello! Welcome to your technical interview. Let's work on an algorithmic problem: Given an array of integers nums and an integer target, how would you find the indices of the two numbers that add up to target?",
          isTerminalTurn: false,
          suggestedFollowUp: 'What is your initial thought on solving this?',
        };
      }

      if (turnCount === 1 || turnCount === 2) {
        if (utterance.includes('hash') || utterance.includes('map') || utterance.includes('dict') || utterance.includes('linear')) {
          return {
            replyText:
              "Great intuition! Using a hash map achieves linear O(n) time. As you iterate through the numbers, what would you store as keys versus values in the map?",
            isTerminalTurn: false,
            turnEvaluation: { clarity: 9.0, technicalAccuracy: 9.0 },
          };
        } else if (utterance.includes('brute') || utterance.includes('loop') || utterance.includes('n^2')) {
          return {
            replyText:
              "A brute force nested loop is a great baseline with O(n^2) time. Can you think of how we might use an auxiliary data structure to reduce the time complexity down to O(n)?",
            isTerminalTurn: false,
            turnEvaluation: { clarity: 8.0, technicalAccuracy: 7.5 },
          };
        } else {
          return {
            replyText:
              "That makes sense. Could you clarify the time and space complexity of that approach before you start implementing?",
            isTerminalTurn: false,
            turnEvaluation: { clarity: 8.0, technicalAccuracy: 8.0 },
          };
        }
      }

      if (turnCount === 3 || turnCount === 4) {
        return {
          replyText:
            "Sounds like a solid plan. Please go ahead and write your implementation in the Monaco code editor on your right, and run the test cases when ready.",
          isTerminalTurn: false,
          turnEvaluation: { clarity: 8.5, technicalAccuracy: 8.5 },
        };
      }

      if (turnCount === 5 || turnCount === 6) {
        if (code.includes('map') || code.includes('target - nums') || code.includes('complement')) {
          return {
            replyText:
              "Your code looks very clean and correctly handles the complement lookup. What would the space complexity be if all elements in the input array were distinct?",
            isTerminalTurn: false,
            turnEvaluation: { clarity: 9.0, technicalAccuracy: 9.5 },
          };
        } else {
          return {
            replyText:
              "Nice progress on the code. Have you tested it with edge cases, such as duplicate elements or negative numbers?",
            isTerminalTurn: false,
            turnEvaluation: { clarity: 8.0, technicalAccuracy: 8.0 },
          };
        }
      }

      // Terminal turn (turnCount >= 7)
      return {
        replyText:
          "Excellent work! You walked through your approach clearly, optimized the lookup to O(n), and tested your implementation thoroughly. That concludes our technical round for today!",
        isTerminalTurn: true,
      };
    }

    // HR Behavioral Interview
    if (input.interviewType === 'HR') {
      const situationKeywords = [
        'project',
        'team',
        'architecture',
        'company',
        'deadline',
        'production',
        'service',
        'client',
        'blocker',
        'disagree',
        'incident',
        'failure',
        'outage',
        'priority',
        'startup',
        'situation',
      ];
      const taskKeywords = [
        'responsible',
        'task',
        'goal',
        'deliver',
        'role',
        'needed to',
        'had to',
        'assignment',
        'objective',
        'sla',
        'responsibility',
      ];
      const actionKeywords = [
        'i ',
        'my ',
        'personally',
        'implemented',
        'investigated',
        'benchmarked',
        'refactored',
        'communicated',
        'designed',
        'created',
        'organized',
        'triaged',
        'decided',
        'stepped up',
        'wrote',
        'set up',
        'built',
        'patched',
        'action',
      ];
      const resultKeywords = [
        'result',
        'outcome',
        'impact',
        'resolved',
        'learned',
        'improved',
        'reduced',
        'prevented',
        'metric',
        'percent',
        '%',
        'on time',
        'success',
        'launched',
        'saved',
      ];

      // Check cumulative candidate history for active dialogue
      const previousCandidateUtterances = (input.dialogueHistory || [])
        .filter((t) => t.role === 'candidate')
        .map((t) => t.content.toLowerCase())
        .join(' ');
      const cumulativeText = `${previousCandidateUtterances} ${utterance}`.trim();

      const hasSituation = situationKeywords.some((k) => cumulativeText.includes(k));
      const hasTask = taskKeywords.some((k) => cumulativeText.includes(k));
      const hasAction = actionKeywords.some((k) => cumulativeText.includes(k));
      const hasResult = resultKeywords.some((k) => cumulativeText.includes(k));

      const starProgress = {
        situation: hasSituation,
        task: hasTask,
        action: hasAction,
        result: hasResult,
      };

      if (turnCount === 0) {
        return {
          replyText:
            "Hello! Welcome to your HR Behavioral Interview. I am Sophia. Today we will explore your past engineering experiences using the STAR method: Situation, Task, Action, and Result. To get started, please tell me about a time when you strongly disagreed with a team member on an architectural decision. How did you navigate that?",
          isTerminalTurn: false,
          isQuestionComplete: false,
          starProgress,
        };
      }

      // Generate natural, conversational acknowledgment based on the student's specific answer
      let naturalAck = "I see, that makes a lot of sense.";
      if (utterance.includes('disagree') || utterance.includes('conflict') || utterance.includes('debate') || utterance.includes('architect')) {
        naturalAck = "I understand completely—navigating architectural disagreements and conflicting technical perspectives requires both diplomatic empathy and solid objective data.";
      } else if (utterance.includes('outage') || utterance.includes('production') || utterance.includes('incident') || utterance.includes('down') || utterance.includes('bug') || utterance.includes('fail')) {
        naturalAck = "Production incidents and downtime can be extremely stressful, and having a blameless, systematic recovery mindset is essential.";
      } else if (utterance.includes('deadline') || utterance.includes('crunch') || utterance.includes('blocker') || utterance.includes('pressure') || utterance.includes('urgent')) {
        naturalAck = "Facing tight deadlines and unforeseen blockers really tests an engineer's composure and prioritization skills.";
      } else if (utterance.includes('priority') || utterance.includes('priorities') || utterance.includes('stakeholder') || utterance.includes('competing')) {
        naturalAck = "Balancing competing stakeholder expectations while protecting core code quality and team velocity is a delicate challenge.";
      } else if (utterance.includes('database') || utterance.includes('pool') || utterance.includes('latency') || utterance.includes('refactor') || utterance.includes('service')) {
        naturalAck = "Tackling backend bottlenecks and connection pooling issues is critical for long-term system stability.";
      } else if (utterance.length > 50) {
        naturalAck = "Thank you for walking me through those details—I appreciate the context you shared.";
      }

      // 1. If Action is missing
      if (!hasAction && (hasSituation || hasTask)) {
        return {
          replyText: `${naturalAck} You've framed the situation and challenges clearly. Could you walk me through the specific technical or interpersonal actions you personally took to resolve it?`,
          isTerminalTurn: false,
          isQuestionComplete: false,
          suggestedFollowUp: 'Explain the concrete actions you personally took.',
          starProgress,
          turnEvaluation: { clarity: 8.5, technicalAccuracy: 8.0 },
        };
      }

      // 2. If Result is missing
      if (!hasResult && (hasSituation || hasAction)) {
        return {
          replyText: `${naturalAck} You explained the steps and initiatives you took very clearly. What was the ultimate outcome, quantifiable metric improvement, or key engineering takeaway from that experience?`,
          isTerminalTurn: false,
          isQuestionComplete: false,
          suggestedFollowUp: 'Quantify the final result, impact, or key takeaways.',
          starProgress,
          turnEvaluation: { clarity: 8.8, technicalAccuracy: 8.5 },
        };
      }

      // 3. Complete STAR story delivered!
      if (hasAction && hasResult && (hasSituation || hasTask)) {
        return {
          replyText: `${naturalAck} That was a wonderfully structured STAR response! You clearly set the context, highlighted your direct personal contributions, and demonstrated measurable impact.

I have unlocked the "Next Question" button for you. Whenever you are ready, please click it to proceed.`,
          isTerminalTurn: false,
          isQuestionComplete: true,
          starProgress,
          turnEvaluation: { clarity: 9.5, technicalAccuracy: 9.0 },
        };
      }

      return {
        replyText: `${naturalAck} Could you elaborate on what you learned from that process and how it influenced your subsequent engineering and team collaboration?`,
        isTerminalTurn: false,
        isQuestionComplete: false,
        starProgress,
        turnEvaluation: { clarity: 8.5, technicalAccuracy: 8.0 },
      };
    }

    return {
      replyText: "Thank you for that response. Let's continue.",
      isTerminalTurn: false,
    };
  }

  async evaluateInterview(input: InterviewEvaluationInput): Promise<InterviewEvaluationOutput> {
    await this.simulateLatency(350);

    const isDSA = input.interviewType === 'DSA';
    const turnsText = input.turns.map((t) => t.content.toLowerCase()).join(' ');
    const codeText = (input.codeSubmissions || []).join(' ').toLowerCase();

    if (!isDSA) {
      // HR Behavioral STAR Evaluation
      let situationScore = 78;
      let taskScore = 76;
      let actionScore = 80;
      let resultScore = 75;
      let communicationScore = 82;

      // Scan candidate turns for STAR components
      if (turnsText.includes('project') || turnsText.includes('team') || turnsText.includes('architecture') || turnsText.includes('production')) {
        situationScore += 10;
      }
      if (turnsText.includes('responsible') || turnsText.includes('goal') || turnsText.includes('task') || turnsText.includes('needed to')) {
        taskScore += 11;
      }
      if (turnsText.includes('i ') || turnsText.includes('personally') || turnsText.includes('implemented') || turnsText.includes('investigated')) {
        actionScore += 12;
      }
      if (turnsText.includes('result') || turnsText.includes('outcome') || turnsText.includes('improved') || turnsText.includes('reduced') || turnsText.includes('%')) {
        resultScore += 13;
      }
      if (input.turns.filter((t) => t.role === 'candidate').length >= 3) {
        communicationScore += 8;
      }

      situationScore = Math.min(98, Math.max(60, situationScore));
      taskScore = Math.min(98, Math.max(60, taskScore));
      actionScore = Math.min(98, Math.max(60, actionScore));
      resultScore = Math.min(98, Math.max(60, resultScore));
      communicationScore = Math.min(98, Math.max(60, communicationScore));

      const competencyScore = Math.round(
        situationScore * 0.2 + taskScore * 0.2 + actionScore * 0.35 + resultScore * 0.25
      );
      const overallScore = Math.round(competencyScore * 0.65 + communicationScore * 0.35);

      let recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE' = 'HIRE';
      if (overallScore >= 88) recommendation = 'STRONG_HIRE';
      else if (overallScore >= 70) recommendation = 'HIRE';
      else if (overallScore >= 55) recommendation = 'NEUTRAL';
      else recommendation = 'NO_HIRE';

      return {
        overallScore,
        technicalScore: competencyScore, // Competency score for HR
        communicationScore,
        starBreakdown: {
          situationScore,
          taskScore,
          actionScore,
          resultScore,
          situationFeedback:
            'Articulated background, team context, and technical stakes with commendable clarity.',
          taskFeedback:
            'Clearly defined personal role, assignments, and expected milestones under pressure.',
          actionFeedback:
            'Demonstrated strong technical ownership, proactive communication, and hands-on initiative.',
          resultFeedback:
            'Effectively highlighted quantifiable impact, performance gains, and reflective growth.',
        },
        keyObservations: [
          'Consistently applied the STAR framework to organize real-world workplace examples.',
          'Demonstrated high emotional intelligence when resolving technical disagreements.',
          'Showed genuine ownership and blameless post-mortem accountability during outages.',
        ],
        recommendation,
        detailedFeedback: {
          strengths: [
            'Structured storytelling using Situation, Task, Action, and Result.',
            'Strong leadership and cross-functional communication skills.',
            'Clear emphasis on business metrics, latency reduction, and reliability.',
          ],
          weaknesses: [
            'Could quantify secondary team productivity gains in addition to direct system metrics.',
          ],
          technicalAnalysis:
            'The candidate demonstrated strong behavioral alignment with senior engineering expectations, exhibiting accountability, leadership, and methodical problem solving.',
          communicationAnalysis:
            'Articulate, concise, and structured. Maintained professional tone with minimal hesitation and excellent response pacing.',
        },
      };
    }

    // DSA Evaluation
    let technicalScore = 75;
    let communicationScore = 80;

    // Technical rubric evaluation
    if (codeText.includes('map') || codeText.includes('dict') || codeText.includes('complement')) {
      technicalScore += 10;
    }
    if (turnsText.includes('o(n)') || turnsText.includes('time complexity') || turnsText.includes('space')) {
      technicalScore += 5;
    }
    if (turnsText.includes('edge case') || turnsText.includes('duplicate') || turnsText.includes('negative')) {
      technicalScore += 4;
    }

    // Communication rubric evaluation
    if (input.turns.filter((t) => t.role === 'candidate').length >= 3) {
      communicationScore += 8;
    }
    if (turnsText.includes('approach') || turnsText.includes('because') || turnsText.includes('first')) {
      communicationScore += 6;
    }

    technicalScore = Math.min(98, Math.max(50, technicalScore));
    communicationScore = Math.min(98, Math.max(50, communicationScore));
    const overallScore = Math.round(technicalScore * 0.6 + communicationScore * 0.4);

    let recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE' = 'HIRE';
    if (overallScore >= 88) recommendation = 'STRONG_HIRE';
    else if (overallScore >= 70) recommendation = 'HIRE';
    else if (overallScore >= 55) recommendation = 'NEUTRAL';
    else recommendation = 'NO_HIRE';

    return {
      overallScore,
      technicalScore,
      communicationScore,
      keyObservations: [
        'Articulated algorithmic strategy clearly before diving into implementation.',
        'Demonstrated strong understanding of time and space complexity tradeoffs.',
        'Listened attentively to hints and structured code cleanly in the editor.',
      ],
      recommendation,
      detailedFeedback: {
        strengths: [
          'Effective communication and structured problem decomposition.',
          'Successfully identified the optimal O(n) hash map lookup solution.',
          'Maintained high code quality and readable variable naming.',
        ],
        weaknesses: [
          'Could explicitly state input constraints and boundary conditions earlier in the discussion.',
        ],
        technicalAnalysis:
          'The candidate demonstrated strong proficiency in data structures and algorithmic efficiency. Solved the problem within expected time constraints.',
        communicationAnalysis:
          'Maintained a confident, professional cadence throughout the interview. Clearly articulated tradeoff reasoning.',
      },
    };
  }
}
