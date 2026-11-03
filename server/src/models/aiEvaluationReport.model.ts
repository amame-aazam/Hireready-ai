import { Schema, model, Document } from 'mongoose';

export interface IStarBreakdown {
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  situationFeedback?: string;
  taskFeedback?: string;
  actionFeedback?: string;
  resultFeedback?: string;
}

export interface IAiEvaluationReport extends Document {
  id: string; // UUID primary identifier
  sessionId: string; // UUID of InterviewSession in Postgres
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  starBreakdown?: IStarBreakdown;
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
    starBreakdown: {
      situationScore: { type: Number },
      taskScore: { type: Number },
      actionScore: { type: Number },
      resultScore: { type: Number },
      situationFeedback: { type: String },
      taskFeedback: { type: String },
      actionFeedback: { type: String },
      resultFeedback: { type: String },
    },
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
