import type { Phase } from '../types';

const STEPS: { key: Phase; label: string }[] = [
  { key: 'setup', label: 'Setup' },
  { key: 'reveal', label: 'Deal' },
  { key: 'briefing', label: 'Brief' },
  { key: 'results', label: 'Results' },
];

export default function StepTabs({ phase }: { phase: Phase }) {
  const activeIndex = STEPS.findIndex((s) => s.key === phase);

  return (
    <div className="tabs">
      {STEPS.map((step, i) => (
        <div
          key={step.key}
          className={`tab ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'done' : ''}`}
        >
          {String(i + 1).padStart(2, '0')} · {step.label}
        </div>
      ))}
    </div>
  );
}
