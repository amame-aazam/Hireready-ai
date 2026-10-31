import { Schema, model, Document } from 'mongoose';

export interface IAiEvaluationReport extends Document {
  id: string; // UUID primary identifier
  sessionId: string; // UUID of InterviewSession in Postgres
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  keyObservations: string[];
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE';
  detailedFeedback: {
    strengths: string[];
    weaknesses: string[];
    technicalAnalysis: string;
    communicationAnalysis: string;
  };
  generatedAt: Date;
}

const AiEvaluationReportSchema = new Schema<IAiEvaluationReport>(
  {
    id: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    overallScore: { type: Number, required: true },
    technicalScore: { type: Number, required: true },
    communicationScore: { type: Number, required: true },
    keyObservations: { type: [String], default: [] },
    recommendation: {
      type: String,
      enum: ['STRONG_HIRE', 'HIRE', 'NEUTRAL', 'NO_HIRE'],
      required: true,
    },
    detailedFeedback: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      technicalAnalysis: { type: String, default: '' },
      communicationAnalysis: { type: String, default: '' },
    },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'ai_evaluation_reports',
  }
);

export const AiEvaluationReportModel = model<IAiEvaluationReport>(
  'AiEvaluationReport',
  AiEvaluationReportSchema
);
