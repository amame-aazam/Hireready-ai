import {
  AIProvider,
  ResumeAnalysisInput,
  ResumeAnalysisOutput,
  InterviewTurnInput,
  InterviewTurnOutput,
  InterviewEvaluationInput,
  InterviewEvaluationOutput,
} from './types';

export class MockAIProvider implements AIProvider {
  public readonly name = 'MockAIProvider';

  private async simulateLatency(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
    await this.simulateLatency(350);

    const length = input.resumeText.length;
    const baseScore = Math.min(85, Math.max(50, Math.floor(length / 20)));

    return {
      score: baseScore,
      atsStrengths: [
        'Clear educational background and chronologically structured experience.',
        'Mentions relevant programming fundamentals and frameworks.',
        'Good inclusion of measurable project outcomes.',
      ],
      atsWeaknesses: [
        'Could include more specific impact metrics (e.g., latency reduction, cost savings).',
        'Section headers could align more strictly with standard ATS naming conventions.',
      ],
      missingKeywords: [
        'CI/CD Pipelines',
        'Docker',
        'System Design',
        'Test-Driven Development (TDD)',
      ],
      suggestedImprovements: [
        'Add quantified bullet points for your primary engineering project.',
        'Highlight experience with distributed architectures and caching solutions.',
      ],
      extractedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'REST APIs'],
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
