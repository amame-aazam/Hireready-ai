import mammoth from 'mammoth';

// Supports both pdf-parse v1 (function) and v2+ (PDFParse class)
const pdfParseModule = require('pdf-parse');

export interface ParsedResumeResult {
  rawText: string;
  pageCount?: number;
  wordCount: number;
}

export class ResumeParser {
  /**
   * Extracts raw text from an ephemeral in-memory buffer (PDF or DOCX).
   */
  async extractText(
    buffer: Buffer,
    mimetype: string,
    originalname: string
  ): Promise<ParsedResumeResult> {
    const isPdf = mimetype === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf');
    const isDocx =
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      const err: any = new Error('Unsupported document format. Only PDF and DOCX are allowed.');
      err.statusCode = 400;
      err.code = 'UNSUPPORTED_DOCUMENT_FORMAT';
      throw err;
    }

    if (!buffer || buffer.length === 0) {
      const err: any = new Error('The uploaded file is empty.');
      err.statusCode = 400;
      err.code = 'EMPTY_DOCUMENT_TEXT';
      throw err;
    }

    let text = '';
    let pageCount: number | undefined;

    try {
      if (isPdf) {
        if (typeof pdfParseModule === 'function') {
          // Classic pdf-parse v1 API
          const data = await pdfParseModule(buffer);
          text = data.text || '';
          pageCount = data.numpages;
        } else if (pdfParseModule.PDFParse) {
          // Modern pdf-parse v2+ class API
          const parser = new pdfParseModule.PDFParse({ data: buffer });
          try {
            const res = await parser.getText();
            text = res.text || '';
            pageCount = res.total;
          } finally {
            await parser.destroy();
          }
        } else {
          throw new Error('Unable to resolve PDF parsing engine');
        }
      } else {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || '';
      }
    } catch (parseError: any) {
      console.error('Document parsing failure:', parseError?.message || parseError);
      const err: any = new Error(
        'Failed to read text from uploaded document. Ensure the file is not corrupted or password-protected.'
      );
      err.statusCode = 422;
      err.code = 'DOCUMENT_EXTRACTION_FAILED';
      throw err;
    }

    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length < 50) {
      const err: any = new Error(
        'The uploaded document contains insufficient or unreadable text. Please ensure it is text-based rather than a scanned image.'
      );
      err.statusCode = 422;
      err.code = 'EMPTY_DOCUMENT_TEXT';
      throw err;
    }

    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;

    return {
      rawText: trimmedText,
      pageCount,
      wordCount,
    };
  }
}

export const resumeParser = new ResumeParser();
