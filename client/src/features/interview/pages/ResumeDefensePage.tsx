import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../../components/common/BackButton';
import { AIAvatar } from '../components/AIAvatar';
import { VoiceControls } from '../components/VoiceControls';
import { TranscriptFeed } from '../components/TranscriptFeed';
import { INTERVIEWER_PERSONAS, InterviewerPersona, Persona } from '../types/persona';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import {
  Layers,
  Activity,
  ArrowRight,
  Trophy,
} from 'lucide-react';

interface DefenseTurn {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  isEvaluation?: boolean;
}

const DEFENSE_QUESTIONS = [
  {
    phase: 'Architecture & Tech Choices',
    question: "Walk me through the high-level architecture of this project. Why did you choose these specific technologies, and what alternatives did you reject?",
    probeCriteria: "Look for concrete reasoning, not just 'it's popular'.",
  },
  {
    phase: 'Scale & Performance Metrics',
    question: "You claim high throughput or responsiveness in this system. Exactly how did you benchmark or measure that? What was the bottleneck before your optimization?",
    probeCriteria: "Demands precise metrics, tooling used, and baseline comparisons.",
  },
  {
    phase: 'Engineering Trade-offs',
    question: "Every architectural choice comes with trade-offs. What did you sacrifice when designing your data flow or storage layer, and what would break first if traffic spiked 50x?",
    probeCriteria: "Tests technical honesty and awareness of system boundaries.",
  },
  {
    phase: 'Production Outages & Recovery',
    question: "Tell me about the hardest production bug or edge case you had to debug in this project. How did you isolate the root cause, and how did you prevent recurrence?",
    probeCriteria: "Evaluates debugging methodology and resilience planning.",
  },
];

export const ResumeDefensePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPersona] = useState<InterviewerPersona>(
    INTERVIEWER_PERSONAS.find((p: Persona) => p.id === 'samarth') || INTERVIEWER_PERSONAS[2]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState('HireReady AI — Intelligent Placement SaaS');
  const [projectDescription, setProjectDescription] = useState(
    'Dual-DB microservices architecture running PostgreSQL (Neon) and MongoDB Atlas with automated ATS scoring and real-time voice interviews.'
  );
  const [turns, setTurns] = useState<DefenseTurn[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [defenseScores] = useState({
    architecture: 85,
    metricsHonesty: 82,
    tradeoffAwareness: 88,
    debuggingResilience: 84,
  });

  const { speak, isSpeaking, isMuted, toggleMute } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechRecSupported,
  } = useSpeechRecognition();

  // Initialize first question
  useEffect(() => {
    const firstQ = DEFENSE_QUESTIONS[0];
    const initialText = `Hello. I'm ${selectedPersona.name}. In this Resume Defense round, I'm going to cross-examine you on "${projectName}". Let's start with your architecture: ${firstQ.question}`;
    
    setTurns([
      {
        id: 'turn-init',
        sender: 'ai',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    speak(initialText);
  }, []);

  const handleCandidateResponse = (responseContent?: string) => {
    const textToSubmit = (responseContent || transcript).trim();
    if (!textToSubmit) return;

    if (isListening) stopListening();

    const candidateTurn: DefenseTurn = {
      id: `turn-cand-${Date.now()}`,
      sender: 'candidate',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextStep = currentStep + 1;
    let aiReplyText = '';

    if (nextStep < DEFENSE_QUESTIONS.length) {
      const nextQ = DEFENSE_QUESTIONS[nextStep];
      aiReplyText = `Understood. Now on ${nextQ.phase}: ${nextQ.question}`;
      setCurrentStep(nextStep);
    } else {
      aiReplyText = `Good defense. You held your ground with sound engineering justification. Let me compile your Resume Defense evaluation report now.`;
      setIsCompleted(true);
    }

    const aiTurn: DefenseTurn = {
      id: `turn-ai-${Date.now()}`,
      sender: 'ai',
      text: aiReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTurns((prev) => [...prev, candidateTurn, aiTurn]);
    resetTranscript();
    speak(aiReplyText);
  };

  const compositeDefenseScore = Math.round(
    (defenseScores.architecture +
      defenseScores.metricsHonesty +
      defenseScores.tradeoffAwareness +
      defenseScores.debuggingResilience) /
      4
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2DDD2] pb-4">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-[#A83E14] bg-[#FFEBE1] px-2.5 py-0.5 rounded-full border border-[#FFD0BC]">
                Deep Dive Round
              </span>
              <span className="text-xs text-[#8C7268]">Candidate Project Examination</span>
            </div>
            <h1 className="text-xl font-serif font-medium text-[#0A0706]">
              Resume &amp; Project Defense
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#6B544A] bg-white px-3 py-1.5 rounded-full border border-[#F2DDD2] shadow-sm">
            Phase {Math.min(currentStep + 1, 4)} of 4: {DEFENSE_QUESTIONS[Math.min(currentStep, 3)].phase}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar, Question Stepper, and Transcript */}
        <div className="lg:col-span-7 space-y-5">
          {/* Persona Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm flex items-center justify-between gap-4">
            <AIAvatar
              persona={selectedPersona}
              isSpeaking={isSpeaking}
              isListening={isListening}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
                {selectedPersona.difficultyTier}
              </span>
              <p className="text-[11px] text-[#8C7268] mt-1 italic max-w-xs">
                &ldquo;{selectedPersona.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Stepper Pills */}
          <div className="grid grid-cols-4 gap-2">
            {DEFENSE_QUESTIONS.map((q, idx) => (
              <div
                key={q.phase}
                className={`p-2.5 rounded-2xl border text-center transition ${
                  idx === currentStep
                    ? 'bg-[#FFEBE1] border-[#FF7A48] text-[#A83E14] font-semibold shadow-sm'
                    : idx < currentStep
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#1F7A3A]'
                    : 'bg-white border-[#F2DDD2] text-[#8C7268]'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">Phase {idx + 1}</div>
                <div className="text-xs truncate">{q.phase.split(' ')[0]}</div>
              </div>
            ))}
          </div>

          {/* Dialogue Transcript */}
          <div className="rounded-3xl bg-white border border-[#F2DDD2] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7268] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#FF7A48]" /> Spoken Defense Dialogue
            </h3>
            <div className="max-h-96 overflow-y-auto pr-1">
              <TranscriptFeed turns={turns as any} />
            </div>
          </div>
        </div>

        {/* Right Column: Project Focus, Voice Controls & Live Rubric */}
        <div className="lg:col-span-5 space-y-5">
          {/* Project Details */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7268]">
                Examined Project
              </h3>
              <span className="text-[10px] text-[#FF7A48] font-bold">From Resume</span>
            </div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm font-semibold text-[#0A0706] focus:outline-none focus:border-[#FF7A48]"
            />
            <textarea
              rows={2}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-xs text-[#6B544A] focus:outline-none focus:border-[#FF7A48] resize-none"
            />
          </div>

          {/* Voice Input Panel */}
          <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-4">
            <VoiceControls
              isListening={isListening}
              transcript={transcript}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSubmit={handleCandidateResponse}
              isSupported={isSpeechRecSupported}
            />
          </div>

          {/* Defense Defense Metrics */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7268] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#FF7A48]" /> Live Rubric Standing
              </h3>
              <span className="text-sm font-serif font-bold text-[#0A0706]">
                {compositeDefenseScore}/100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6B544A]">
                <span>Architecture Justification</span>
                <span className="font-semibold text-[#0A0706]">{defenseScores.architecture}%</span>
              </div>
              <div className="w-full bg-[#FFFAF7] h-2 rounded-full border border-[#F2DDD2] overflow-hidden">
                <div className="bg-[#FF7A48] h-full rounded-full" style={{ width: `${defenseScores.architecture}%` }} />
              </div>

              <div className="flex justify-between text-[#6B544A] pt-1">
                <span>Metrics &amp; Benchmark Honesty</span>
                <span className="font-semibold text-[#0A0706]">{defenseScores.metricsHonesty}%</span>
              </div>
              <div className="w-full bg-[#FFFAF7] h-2 rounded-full border border-[#F2DDD2] overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${defenseScores.metricsHonesty}%` }} />
              </div>

              <div className="flex justify-between text-[#6B544A] pt-1">
                <span>Trade-off Awareness</span>
                <span className="font-semibold text-[#0A0706]">{defenseScores.tradeoffAwareness}%</span>
              </div>
              <div className="w-full bg-[#FFFAF7] h-2 rounded-full border border-[#F2DDD2] overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${defenseScores.tradeoffAwareness}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 bg-[#0A0706]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#F2DDD2] rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-xl text-center">
            <div className="p-4 rounded-full bg-[#E6F4EA] text-[#1F7A3A] w-fit mx-auto border border-[#B7E1CD]">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F7A3A]">
                Defense Cleared
              </span>
              <h2 className="text-2xl font-serif font-normal text-[#0A0706]">
                Resume Defense Evaluation
              </h2>
              <p className="text-xs text-[#6B544A] max-w-sm mx-auto">
                You successfully defended your project against cross-examination by {selectedPersona.name}.
              </p>
            </div>

            <div className="p-4 bg-[#FFFAF7] border border-[#F2DDD2] rounded-2xl flex items-center justify-around">
              <div>
                <div className="text-xs text-[#8C7268]">Defense Score</div>
                <div className="text-2xl font-serif font-bold text-[#0A0706]">
                  {compositeDefenseScore}/100
                </div>
              </div>
              <div className="w-px h-8 bg-[#F2DDD2]" />
              <div>
                <div className="text-xs text-[#8C7268]">Standing</div>
                <div className="text-sm font-semibold text-[#1F7A3A]">Senior Tier Pass</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white text-xs font-semibold transition"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate('/interview/dsa')}
                className="px-6 py-3 rounded-full bg-[#FF7A48] hover:bg-[#FF6428] text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>Take DSA Technical Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResumeDefensePage;
