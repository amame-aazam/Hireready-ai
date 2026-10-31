import { Schema, model, Document } from 'mongoose';

export interface IScoreBreakdown {
  keywordScore: number; // 0 - 30
  impactScore: number; // 0 - 30
  formattingScore: number; // 0 - 20
  skillsScore: number; // 0 - 20
}

export interface IResumeAnalysis extends Document {
  id: string; // UUID primary identifier
  userId: string; // UUID of User in Postgres
  applicationId?: string; // UUID of Application in Postgres
  domainId?: string; // UUID of Domain in Postgres
  targetDomain: string;
  contentHash: string; // SHA-256(userId + sanitizedText + targetDomain) for idempotency
  score: number;
  scoreBreakdown: IScoreBreakdown;
  atsStrengths: string[];
  atsWeaknesses: string[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  extractedSkills: string[];
  rawTextSnapshot: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreBreakdownSchema = new Schema<IScoreBreakdown>(
  {
    keywordScore: { type: Number, required: true },
    impactScore: { type: Number, required: true },
    formattingScore: { type: Number, required: true },
    skillsScore: { type: Number, required: true },
  },
  { _id: false }
);

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    applicationId: { type: String, index: true },
    domainId: { type: String, index: true },
    targetDomain: { type: String, required: true },
    contentHash: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    scoreBreakdown: { type: ScoreBreakdownSchema, required: true },
    atsStrengths: { type: [String], default: [] },
    atsWeaknesses: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    suggestedImprovements: { type: [String], default: [] },
    extractedSkills: { type: [String], default: [] },
    rawTextSnapshot: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'resume_analyses',
  }
);

// Compound index for user history retrieval (10k scale optimization)
ResumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

export const ResumeAnalysisModel = model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);
