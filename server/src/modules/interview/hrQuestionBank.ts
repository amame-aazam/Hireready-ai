export interface HRQuestion {
  id: string;
  competency: string;
  title: string;
  prompt: string;
  starTips: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  probingFollowUps: {
    missingAction: string;
    missingResult: string;
    missingTask: string;
    missingSituation: string;
  };
  keywords: {
    situation: string[];
    task: string[];
    action: string[];
    result: string[];
  };
}

export const HR_QUESTION_BANK: HRQuestion[] = [
  {
    id: 'hr-conflict-resolution',
    competency: 'Conflict Resolution',
    title: 'Navigating Technical Disagreements',
    prompt:
      'Tell me about a time when you strongly disagreed with a coworker, tech lead, or stakeholder regarding an architectural decision or engineering trade-off. How did you handle the situation and what was the outcome?',
    starTips: {
      situation: 'Explain the project, the conflicting perspectives, and what was at stake.',
      task: 'Define your responsibility and what needed to be decided or delivered.',
      action: 'Detail the concrete steps you took: objective benchmarks, 1-on-1 conversations, or design docs.',
      result: 'Describe the consensus reached, business impact, and how it affected your working relationship.',
    },
    probingFollowUps: {
      missingAction:
        'You outlined the disagreement and context very well. Could you explain the specific steps and actions you personally took to navigate the discussion?',
      missingResult:
        'That provides great perspective on your approach. What was the ultimate outcome or technical result of that discussion on the project?',
      missingTask:
        'Understood. What was your specific role and responsibility in arriving at that decision within the team?',
      missingSituation:
        'Could you provide a bit more context on the project and the specific technical trade-offs involved?',
    },
    keywords: {
      situation: [
        'project',
        'architecture',
        'team',
        'coworker',
        'engineer',
        'lead',
        'disagree',
        'decision',
        'trade-off',
        'codebase',
        'service',
        'stack',
      ],
      task: [
        'goal',
        'task',
        'responsible',
        'deliver',
        'consensus',
        'objective',
        'needed to',
        'had to',
        'my role',
      ],
      action: [
        'i benchmarked',
        'i proposed',
        'i scheduled',
        'i listened',
        'i wrote',
        'i gathered',
        'i analyzed',
        'i suggested',
        'i demonstrated',
        'i compromised',
        'i researched',
        'i presented',
        'we sat down',
        'personally',
        'my approach',
      ],
      result: [
        'result',
        'outcome',
        'consensus',
        'agreed',
        'delivered',
        'improved',
        'reduced',
        'on time',
        'learned',
        'adopted',
        'successful',
        'relationship',
      ],
    },
  },
  {
    id: 'hr-ownership-leadership',
    competency: 'Ownership & Initiative',
    title: 'Taking Ownership Under Pressure',
    prompt:
      'Describe a situation where a critical project or feature faced an unexpected blocker, tight deadline, or ambiguity. How did you step up to take ownership and ensure delivery?',
    starTips: {
      situation: 'Set the scene: the project, the blocker or tight deadline, and the impact if delayed.',
      task: 'What was your responsibility and what goal did you commit to achieving?',
      action: 'Detail the proactive steps you took to unblock the team, prioritize tasks, or solve the root cause.',
      result: 'Share the measurable result: delivered on time, prevented downtime, or improved team velocity.',
    },
    probingFollowUps: {
      missingAction:
        'You clearly articulated the challenge and pressure. What specific actions or initiatives did you personally take to overcome the roadblock?',
      missingResult:
        'That sounds like a demanding situation. What was the final quantifiable result or business impact after taking those steps?',
      missingTask:
        'Could you clarify your exact assignment or commitment during that critical crunch period?',
      missingSituation:
        'Could you share more background on the project timeline and what made this particular blocker so critical?',
    },
    keywords: {
      situation: [
        'blocker',
        'deadline',
        'crunch',
        'pressure',
        'project',
        'feature',
        'release',
        'client',
        'production',
        'startup',
        'roadblock',
      ],
      task: [
        'goal',
        'task',
        'responsible',
        'deliver',
        'commit',
        'timeline',
        'needed to',
        'had to',
        'milestone',
      ],
      action: [
        'i stepped up',
        'i organized',
        'i refactored',
        'i implemented',
        'i coordinated',
        'i triaged',
        'i communicated',
        'i worked',
        'i automated',
        'i built',
        'i identified',
        'personally',
        'my initiative',
      ],
      result: [
        'result',
        'delivered',
        'on time',
        'launched',
        'saved',
        'reduced',
        'prevented',
        'hours',
        'impact',
        'feedback',
        'success',
        'metrics',
      ],
    },
  },
  {
    id: 'hr-failure-adaptability',
    competency: 'Resilience & Growth Mindset',
    title: 'Overcoming Failure & Production Outages',
    prompt:
      'We all encounter moments where things do not go as planned. Tell me about a time when a project or system you worked on failed, caused an incident, or fell short of expectations. How did you handle it and what did you learn?',
    starTips: {
      situation: 'Describe the system or feature and what went wrong or broke.',
      task: 'What was the immediate containment task and your role in the remediation?',
      action: 'Describe the troubleshooting, root cause analysis (RCA), blameless post-mortem, or fix.',
      result: 'Explain the safeguards put in place, what you learned, and how it made you a better engineer.',
    },
    probingFollowUps: {
      missingAction:
        'Thank you for being transparent about the incident. What concrete steps did you take during triage and to implement long-term preventative safeguards?',
      missingResult:
        'What were the key takeaways or architectural improvements that resulted from this experience?',
      missingTask:
        'What was your specific responsibility during the recovery and post-incident process?',
      missingSituation:
        'Could you explain a bit more about the system architecture and how the failure initially surfaced?',
    },
    keywords: {
      situation: [
        'failure',
        'bug',
        'outage',
        'incident',
        'production',
        'downtime',
        'error',
        'crash',
        'deployment',
        'system',
        'database',
      ],
      task: [
        'triage',
        'recovery',
        'fix',
        'responsible',
        'containment',
        'restore',
        'needed to',
        'had to',
        'objective',
      ],
      action: [
        'i investigated',
        'i rolled back',
        'i patched',
        'i conducted',
        'i analyzed',
        'i wrote tests',
        'i added monitoring',
        'i set up alerts',
        'i documented',
        'personally',
        'root cause',
        'post-mortem',
      ],
      result: [
        'learned',
        'prevented',
        'improved',
        'zero downtime',
        'monitoring',
        'reliability',
        'uptime',
        'safeguard',
        'better engineer',
        'growth',
        'metrics',
      ],
    },
  },
  {
    id: 'hr-prioritization-pressure',
    competency: 'Prioritization & Stakeholders',
    title: 'Managing Competing Priorities',
    prompt:
      'Can you share an experience where you had to juggle multiple competing priorities, urgent bug fixes, and stakeholder requests simultaneously? How did you prioritize what to work on first?',
    starTips: {
      situation: 'Describe the competing requests, stakeholders involved, and timeline constraints.',
      task: 'What was the core goal you needed to protect without compromising quality?',
      action: 'Explain the prioritization framework or communication strategy you used to manage expectations.',
      result: 'Share the outcome: delivered milestones, stakeholder satisfaction, and how you maintained focus.',
    },
    probingFollowUps: {
      missingAction:
        'You clearly had a lot on your plate. What specific criteria or framework did you use to prioritize tasks and communicate with stakeholders?',
      missingResult:
        'How did that prioritization play out in the end for the project delivery and stakeholder satisfaction?',
      missingTask:
        'What was your primary commitment or SLA that you needed to fulfill during that period?',
      missingSituation:
        'Could you share a bit more about the stakeholders involved and the nature of their competing requests?',
    },
    keywords: {
      situation: [
        'priorities',
        'stakeholders',
        'competing',
        'urgent',
        'requests',
        'sprint',
        'timeline',
        'tasks',
        'demands',
        'management',
      ],
      task: [
        'balance',
        'sla',
        'deadline',
        'responsible',
        'deliverable',
        'needed to',
        'had to',
        'focus',
      ],
      action: [
        'i categorized',
        'i used',
        'i communicated',
        'i negotiated',
        'i scheduled',
        'i delegated',
        'i aligned',
        'i prioritized',
        'i set expectations',
        'personally',
        'impact matrix',
      ],
      result: [
        'delivered',
        'satisfied',
        'on schedule',
        'prevented burnout',
        'efficiency',
        'completed',
        'feedback',
        'successful',
        'milestone',
      ],
    },
  },
];
