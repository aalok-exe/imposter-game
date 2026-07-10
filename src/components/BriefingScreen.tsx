import StampButton from './StampButton';

interface BriefingScreenProps {
  onProceed: () => void;
}

const RULE_TILES = [
  {
    step: '01',
    title: 'One word each',
    body: 'Going clockwise from the starter, each player says one word related to their card.',
    accent: 'pink',
  },
  {
    step: '02',
    title: 'No rush',
    body: 'No discussion timer — take as long as the table needs.',
    accent: 'violet',
  },
  {
    step: '03',
    title: 'Call the vote',
    body: "When everyone's said their word, vote out loud for who you think the imposter is.",
    accent: 'lime',
  },
] as const;

export default function BriefingScreen({ onProceed }: BriefingScreenProps) {
  return (
    <div className="card">
      <p className="card-eyebrow">Step 3 — Table Briefing</p>
      <h2 className="card-title">Put the phone down and talk it out</h2>

      <div className="briefing-layout">
        <div className="briefing-mascot" aria-hidden="true">
          <img src="/briefing-dance.gif" alt="" className="briefing-mascot-gif" />
        </div>

        {RULE_TILES.map((rule) => (
          <div key={rule.step} className={`rule-tile accent-${rule.accent} briefing-tile`}>
            <div className="rule-tile-heading">
              <span className="rule-tile-step">{rule.step}</span>
              <h3 className="rule-tile-title">{rule.title}</h3>
            </div>
            <p className="rule-tile-body">{rule.body}</p>
          </div>
        ))}
      </div>

      <StampButton variant="primary" onClick={onProceed}>
        We've voted — reveal answer
      </StampButton>
    </div>
  );
}
