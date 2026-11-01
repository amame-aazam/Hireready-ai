export interface TestCaseItem {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface TestCaseExecutionResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  memoryKb: number;
  stdout?: string;
  stderr?: string;
}

export interface QuestionExecutionSummary {
  passedCount: number;
  totalCount: number;
  scoreRatio: number; // 0.0 to 1.0
  allPassed: boolean;
  results: TestCaseExecutionResult[];
}

export class MockCodeExecutor {
  /**
   * Validate code syntax safely without using eval() or vm
   */
  private static checkBasicSyntax(code: string): { isValid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return { isValid: false, error: 'Empty code submission' };
    }

    // Bracket balance check
    const stack: string[] = [];
    const pairs: Record<string, string> = { '}': '{', ']': '[', ')': '(' };
    let inString: string | null = null;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && (i === 0 || code[i - 1] !== '\\')) {
        if (inString === char) {
          inString = null;
        } else if (!inString) {
          inString = char;
        }
        continue;
      }

      if (inString) continue;

      if (char === '{' || char === '[' || char === '(') {
        stack.push(char);
      } else if (char === '}' || char === ']' || char === ')') {
        if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
          return { isValid: false, error: `SyntaxError: Unmatched closing token '${char}'` };
        }
        stack.pop();
      }
    }

    if (stack.length > 0) {
      return { isValid: false, error: `SyntaxError: Unclosed token '${stack[stack.length - 1]}'` };
    }

    return { isValid: true };
  }

  /**
   * Deterministically analyze student code logic against expected solution characteristics
   */
  private static analyzeCodeIntelligence(
    code: string,
    title: string,
    language: string
  ): { passesGeneral: boolean; failureReason?: string } {
    const trimmed = code.trim();
    const lower = trimmed.toLowerCase();

    // Check if code is just starter code or placeholder
    if (
      lower.includes('// write your code here') &&
      trimmed.split('\n').filter((l) => !l.trim().startsWith('//') && l.trim().length > 0).length <= 2
    ) {
      return { passesGeneral: false, failureReason: 'Incomplete implementation' };
    }

    if (trimmed.includes('pass') && trimmed.split('\n').length <= 3 && language === 'python') {
      return { passesGeneral: false, failureReason: 'Incomplete implementation' };
    }

    // Specific algorithmic pattern detection
    const titleLower = title.toLowerCase();

    if (titleLower.includes('two sum')) {
      const hasMapOrDict = lower.includes('map') || lower.includes('dict') || lower.includes('{') || lower.includes('in nums');
      const hasLoop = lower.includes('for') || lower.includes('while');
      const hasReturn = lower.includes('return');
      if (hasReturn && hasLoop && hasMapOrDict) {
        return { passesGeneral: true };
      }
      if (hasReturn && hasLoop) {
        // Brute force O(n^2) still passes functional tests in screening
        return { passesGeneral: true };
      }
      return { passesGeneral: false, failureReason: 'Wrong Answer: Target sum pair not identified' };
    }

    if (titleLower.includes('palindrome')) {
      const hasReverseOrPointer =
        lower.includes('reverse') ||
        lower.includes('[::-1]') ||
        lower.includes('replace') ||
        (lower.includes('while') && lower.includes('<'));
      const hasReturn = lower.includes('return');
      if (hasReturn && hasReverseOrPointer) {
        return { passesGeneral: true };
      }
      return { passesGeneral: false, failureReason: 'Wrong Answer: Palindrome condition not met' };
    }

    if (titleLower.includes('debounce')) {
      const hasTimer = lower.includes('settimeout') || lower.includes('cleartimeout');
      const hasReturn = lower.includes('return');
      if (hasReturn && hasTimer) {
        return { passesGeneral: true };
      }
      return { passesGeneral: false, failureReason: 'Wrong Answer: Debounce timer not scheduled or cleared' };
    }

    if (titleLower.includes('lru cache')) {
      const hasMap = lower.includes('map') || lower.includes('dict') || lower.includes('order');
      const hasMethods = lower.includes('get') && lower.includes('put');
      if (hasMap && hasMethods) {
        return { passesGeneral: true };
      }
      return { passesGeneral: false, failureReason: 'Wrong Answer: LRU eviction order mismatch' };
    }

    // General fallback: does it contain return statement and reasonable body?
    if (lower.includes('return') && trimmed.length > 40) {
      return { passesGeneral: true };
    }

    return { passesGeneral: false, failureReason: 'Wrong Answer: Output does not match expected test cases' };
  }

  /**
   * Execute code against a set of test cases safely without eval()
   */
  public static async executeTestCases(
    code: string,
    language: string,
    questionTitle: string,
    testCases: TestCaseItem[],
    visibleOnly: boolean = false
  ): Promise<QuestionExecutionSummary> {
    const casesToRun = visibleOnly ? testCases.filter((tc) => !tc.isHidden) : testCases;

    const syntaxCheck = this.checkBasicSyntax(code);
    if (!syntaxCheck.isValid) {
      const results: TestCaseExecutionResult[] = casesToRun.map((tc) => ({
        testCaseId: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Compilation Error',
        passed: false,
        executionTimeMs: 12,
        memoryKb: 14200,
        stderr: syntaxCheck.error,
      }));

      return {
        passedCount: 0,
        totalCount: casesToRun.length,
        scoreRatio: 0,
        allPassed: false,
        results,
      };
    }

    const analysis = this.analyzeCodeIntelligence(code, questionTitle, language);

    const results: TestCaseExecutionResult[] = casesToRun.map((tc, index) => {
      // Simulate slight execution timing variation (40ms - 85ms)
      const executionTimeMs = 45 + ((index * 13 + code.length) % 35);
      const memoryKb = 15400 + ((index * 29 + code.length * 3) % 4000);

      if (analysis.passesGeneral) {
        return {
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
          passed: true,
          executionTimeMs,
          memoryKb,
          stdout: `Test case passed (${executionTimeMs}ms, ${(memoryKb / 1024).toFixed(1)}MB)`,
        };
      } else {
        return {
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'undefined',
          passed: false,
          executionTimeMs,
          memoryKb,
          stderr: analysis.failureReason || 'Output does not match expected value',
        };
      }
    });

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    const scoreRatio = totalCount > 0 ? passedCount / totalCount : 0;

    return {
      passedCount,
      totalCount,
      scoreRatio,
      allPassed: passedCount === totalCount && totalCount > 0,
      results,
    };
  }
}
