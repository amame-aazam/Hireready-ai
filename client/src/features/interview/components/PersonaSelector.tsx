import React, { useState } from 'react';
import { Persona, TECHNICAL_PERSONAS, PersonaDifficulty } from '../types/persona';
import { PersonaAvatar } from './PersonaAvatar';
import { Check, Sparkles, ShieldAlert, Award } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  className?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
  className = '',
}) => {
  const [activeTier, setActiveTier] = useState<PersonaDifficulty | 'All'>('All');

  const filteredPersonas =
    activeTier === 'All'
      ? TECHNICAL_PERSONAS
      : TECHNICAL_PERSONAS.filter((p) => p.difficulty === activeTier);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Warm-up':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Bar-raiser':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#F0B87A]" />;
      default:
        return <Award className="w-3.5 h-3.5 text-[#F0B87A]" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider">
          Choose Your Interviewer
        </label>
        <div className="inline-flex rounded-full bg-[#140705] p-1 border border-[#3E1D19] shadow-inner">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => {
            const isSelected = activeTier === difficulty;
            const label =
              difficulty === 'All'
                ? 'All Personas'
                : difficulty === 'Easy'
                ? 'Warm-up'
                : difficulty === 'Medium'
                ? 'Real Round'
                : 'Bar-raiser';

            return (
              <button
                key={difficulty}
                type="button"
                onClick={() => setActiveTier(difficulty)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold shadow-sm'
                    : 'text-[#A88879] hover:text-[#F5E8DD]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPersonas.map((persona) => {
          const isSelected = selectedPersona.key === persona.key;

          return (
            <div
              key={persona.key}
              onClick={() => onSelectPersona(persona)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? 'bg-[#2D1A10] border-[#F0B87A] shadow-[0_0_25px_rgba(240,184,122,0.25)]'
                  : 'bg-[#1A0C09]/80 border-[#3E1D19] hover:bg-[#24110E] hover:border-[#52251D]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#F0B87A] text-[#140808] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <PersonaAvatar persona={persona} size="md" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-medium text-sm text-[#F5E8DD] group-hover:text-[#F0B87A] transition">
                      {persona.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-[#A88879]">{persona.role}</div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#140705] border border-[#3E1D19] text-[10px] text-[#F0B87A] mt-1">
                    {getTierIcon(persona.difficultyTier)}
                    <span>{persona.difficultyTier}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#A88879] italic line-clamp-2">
                &ldquo;{persona.quote}&rdquo;
              </p>

              <div className="pt-2 border-t border-[#3E1D19] text-[11px] text-[#856658] flex justify-between">
                <span>Approach: <strong className="text-[#D4B8A8]">{persona.approachStrictness}</strong></span>
                <span>Hints: <strong className="text-[#D4B8A8]">{persona.hintFrequency}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
