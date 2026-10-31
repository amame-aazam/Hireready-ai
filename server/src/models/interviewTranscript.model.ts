import { Schema, model, Document } from 'mongoose';

export interface ITranscriptTurn {
  role: 'ai' | 'candidate';
  content: string;
  timestamp: Date;
  durationMs?: number;
  codeSnippet?: string;
}

export interface IInterviewTranscript extends Document {
  id: string; // UUID primary identifier
  sessionId: string; // UUID of InterviewSession in Postgres
  turns: ITranscriptTurn[];
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptTurnSchema = new Schema<ITranscriptTurn>(
  {
    role: { type: String, enum: ['ai', 'candidate'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    durationMs: { type: Number },
    codeSnippet: { type: String },
  },
  { _id: false }
);

const InterviewTranscriptSchema = new Schema<IInterviewTranscript>(
  {
    id: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    turns: { type: [TranscriptTurnSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'interview_transcripts',
  }
);

export const InterviewTranscriptModel = model<IInterviewTranscript>(
  'InterviewTranscript',
  InterviewTranscriptSchema
);
