import {
  AIProvider,
  ResumeAnalysisInput,
  ResumeAnalysisOutput,
  InterviewTurnInput,
  InterviewTurnOutput,
  InterviewEvaluationInput,
  InterviewEvaluationOutput,
} from './types';
import { env } from '../../config/env';

export class DeepSeekAdapter implements AIProvider {
  public readonly name = 'DeepSeekAdapter';
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = env.DEEPSEEK_API_KEY;
    this.baseUrl = env.DEEPSEEK_BASE_URL.replace(/\/+$/, '');
  }

  private async callChatCompletion(systemPrompt: string, userMessage: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured in environment.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
    }

    const json = (await response.json()) as any;
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('DeepSeek returned an empty response content');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Failed to parse DeepSeek JSON response: ${content}`);
    }
  }

  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
    const systemPrompt = `You are an expert technical ATS evaluator and senior hiring bar-raiser.
Evaluate the resume objectively for the role/domain: "${input.targetDomain || 'Full Stack Software Engineer'}".
Respond strictly with valid JSON conforming to this schema:
{
  "score": number (0-100),
  "scoreBreakdown": {
    "keywordScore": number (0-30),
    "impactScore": number (0-30),
    "formattingScore": number (0-20),
    "skillsScore": number (0-20)
  },
  "atsStrengths": string[],
  "atsWeaknesses": string[],
  "missingKeywords": string[],
  "suggestedImprovements": string[],
  "extractedSkills": string[]
}`;

    return this.callChatCompletion(systemPrompt, `Candidate Resume:\n${input.resumeText}`);
  }

  async generateInterviewTurn(input: InterviewTurnInput): Promise<InterviewTurnOutput> {
    const systemPrompt = `You are an experienced ${input.interviewType} interviewer at a top tech company.
Engage in a professional, realistic turn-based technical or behavioral interview.
Keep responses concise (under 3 sentences) and speak naturally suitable for text-to-speech.
Respond strictly in JSON format:
{
  "replyText": string,
  "isTerminalTurn": boolean,
  "suggestedFollowUp": string,
  "turnEvaluation": { "clarity": number (0-10), "technicalAccuracy": number (0-10) }
}`;

    const dialogueContext = input.dialogueHistory
      .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
      .join('\n');

    const promptMessage = `History:\n${dialogueContext}\n\nCandidate's Latest: ${
      input.latestCandidateUtterance || ''
    }\nCode snippet (if any): ${input.codeSnippet || 'None'}`;

    return this.callChatCompletion(systemPrompt, promptMessage);
  }

  async evaluateInterview(input: InterviewEvaluationInput): Promise<InterviewEvaluationOutput> {
    const systemPrompt = `You are the lead hiring committee chair evaluating an interview transcript.
Generate a structured, fair assessment report.
Respond strictly in JSON format:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "keyObservations": string[],
  "recommendation": "STRONG_HIRE" | "HIRE" | "NEUTRAL" | "NO_HIRE",
  "detailedFeedback": {
    "strengths": string[],
    "weaknesses": string[],
    "technicalAnalysis": string,
    "communicationAnalysis": string
  }
}`;

    const formattedTranscript = input.turns
      .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
      .join('\n');

    return this.callChatCompletion(
      systemPrompt,
      `Interview Type: ${input.interviewType}\nTranscript:\n${formattedTranscript}`
    );
  }
}
