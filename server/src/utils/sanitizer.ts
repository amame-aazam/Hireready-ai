export interface SanitizeOptions {
  maxLength?: number;
  allowNewlines?: boolean;
}

/**
 * Sanitizes untrusted user-supplied resume text before database persistence or LLM prompt insertion.
 * - Strips ASCII control/null bytes
 * - Normalizes Unicode and repeated whitespaces
 * - Enforces hard character length limits to prevent token-exhaustion DoS
 */
export const sanitizeResumeText = (
  rawText: string,
  options: SanitizeOptions = {}
): { sanitized: string; originalLength: number; truncated: boolean } => {
  const { maxLength = 12000 } = options;

  if (!rawText || typeof rawText !== 'string') {
    return { sanitized: '', originalLength: 0, truncated: false };
  }

  const originalLength = rawText.length;

  // 1. Remove null bytes and non-printable control characters (except \n, \r, \t)
  let clean = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Normalize carriage returns and multiple newlines
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  clean = clean.replace(/\n{3,}/g, '\n\n');

  // 3. Normalize multiple horizontal spaces/tabs
  clean = clean.replace(/[ \t]+/g, ' ');

  // 4. Trim leading/trailing whitespace
  clean = clean.trim();

  // 5. Enforce upper bound
  const truncated = clean.length > maxLength;
  if (truncated) {
    clean = clean.substring(0, maxLength);
  }

  return {
    sanitized: clean,
    originalLength,
    truncated,
  };
};

/**
 * Validates UUID v4 string format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof uuid === 'string' && uuidRegex.test(uuid);
};
