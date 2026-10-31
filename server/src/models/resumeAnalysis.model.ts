import { Schema, model, Document } from 'mongoose';

export interface IResumeAnalysis extends Document {
  id: string; // UUID primary identifier
  userId: string; // UUID of User in Postgres
  applicationId?: string; // UUID of Application in Postgres
  score: number;
  atsStrengths: string[];
  atsWeaknesses: string[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  extractedSkills: string[];
  rawTextSnapshot: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    applicationId: { type: String, index: true },
    score: { type: Number, required: true },
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

export const ResumeAnalysisModel = model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);
