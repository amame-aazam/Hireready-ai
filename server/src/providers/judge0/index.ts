import { env } from '../../config/env';

export interface CodeExecutionRequest {
  sourceCode: string;
  languageId: number; // e.g. 63 for JavaScript, 71 for Python, 62 for Java, 54 for C++
  stdin?: string;
  expectedOutput?: string;
}

export interface CodeExecutionResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'QUOTA_EXCEEDED';
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  timeMs?: number;
  memoryKb?: number;
  passed?: boolean;
}

class Judge0QuotaTracker {
  private dailyCount = 0;
  private lastResetDate: string = new Date().toISOString().split('T')[0];
  private readonly maxDailyRequests = 45; // Safety margin for Judge0 50 req/day free tier

  private checkAndReset(): void {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.lastResetDate) {
      this.dailyCount = 0;
      this.lastResetDate = today;
    }
  }

  public canExecute(): boolean {
    this.checkAndReset();
    return this.dailyCount < this.maxDailyRequests;
  }

  public recordRequest(): void {
    this.checkAndReset();
    this.dailyCount += 1;
  }

  public getRemainingDailyQuota(): number {
    this.checkAndReset();
    return Math.max(0, this.maxDailyRequests - this.dailyCount);
  }
}

export const judge0QuotaTracker = new Judge0QuotaTracker();

export class Judge0Client {
  private isMock: boolean;

  constructor() {
    this.isMock = env.JUDGE0_MOCK || !env.JUDGE0_API_KEY;
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    if (this.isMock) {
      // Simulate sandbox execution delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const hasSyntaxError = request.sourceCode.includes('SYNTAX_ERROR_TRIGGER');
      if (hasSyntaxError) {
        return {
          status: 'COMPILATION_ERROR',
          compileOutput: 'SyntaxError: Unexpected token',
          passed: false,
        };
      }

      return {
        status: 'ACCEPTED',
        stdout: request.expectedOutput || 'Execution completed successfully',
        timeMs: 42,
        memoryKb: 1420,
        passed: true,
      };
    }

    // Remote Judge0 execution with rate limit safety check
    if (!judge0QuotaTracker.canExecute()) {
      return {
        status: 'QUOTA_EXCEEDED',
        stderr: 'Daily free-tier sandbox execution quota reached (45/50 requests). Please try again tomorrow.',
        passed: false,
      };
    }

    judge0QuotaTracker.recordRequest();

    const response = await fetch(
      `https://${env.JUDGE0_API_HOST}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': env.JUDGE0_API_HOST,
          'x-rapidapi-key': env.JUDGE0_API_KEY,
        },
        body: JSON.stringify({
          source_code: request.sourceCode,
          language_id: request.languageId,
          stdin: request.stdin || '',
          expected_output: request.expectedOutput || '',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const isAccepted = data.status?.id === 3;

    return {
      status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
      stdout: data.stdout,
      stderr: data.stderr,
      compileOutput: data.compile_output,
      timeMs: data.time ? parseFloat(data.time) * 1000 : undefined,
      memoryKb: data.memory,
      passed: isAccepted,
    };
  }
}

export const judge0Client = new Judge0Client();
