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
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Bar-raiser':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Award className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-[#0A0706] uppercase tracking-wider">
          Choose Your Interviewer
        </label>
        <div className="inline-flex rounded-full bg-white p-1 border border-[#F2DDD2] shadow-xs">
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
                    ? 'bg-[#FF7A48] text-white shadow-xs'
                    : 'text-[#6B544A] hover:text-[#0A0706]'
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
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFF5F0] border-[#FF7A48] shadow-md ring-2 ring-[#FF7A48]'
                  : 'bg-white border-[#F2DDD2] hover:border-[#E8CBBE] hover:shadow-sm'
              }`}
            >
              {/* Top Row: Avatar & Selected Checkmark */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <PersonaAvatar persona={persona} size="md" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#0A0706]">{persona.name}</h4>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1"
                        style={{
                          backgroundColor: persona.accentBg,
                          borderColor: persona.accentBorder,
                          color: persona.accentColor,
                        }}
                      >
                        {getTierIcon(persona.tier)}
                        <span>{persona.tier}</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#6B544A] mt-0.5">{persona.role}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#FF7A48] border-[#FF7A48] text-white'
                      : 'border-[#F2DDD2] bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Tagline & Personality */}
              <div className="space-y-1.5 my-1">
                <p className="text-xs font-semibold text-[#0A0706] italic">
                  "{persona.tagline}"
                </p>
                <p className="text-[11px] text-[#6B544A] leading-relaxed line-clamp-2">
                  {persona.description}
                </p>
              </div>

              {/* Footer Specs */}
              <div className="pt-2.5 mt-2 border-t border-[#F2DDD2] flex items-center justify-between text-[10px] text-[#8C7268]">
                <span>Approach: <strong className="text-[#0A0706] capitalize">{persona.approachStrictness}</strong></span>
                <span>Hints: <strong className="text-[#0A0706] capitalize">{persona.hintFrequency}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
