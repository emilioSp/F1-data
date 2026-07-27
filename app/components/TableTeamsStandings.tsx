import type { GPTeamsStandings } from '@/app/types';
import { displayPoints } from '@/app/utils/points';

const COLS = 'grid-cols-[40px_1fr_76px]';

export default function TableTeamsStandings({
  results,
}: {
  results: GPTeamsStandings[];
}) {
  return (
    <div className="rounded-[8px] border border-card-border bg-card">
      <div
        className={`grid ${COLS} items-center border-b border-divider px-5 py-[13px] text-[10px] font-sans font-medium tracking-[.14em] text-faint`}
      >
        <div>POS</div>
        <div>TEAM</div>
        <div className="text-right">POINTS</div>
      </div>
      {results.map((r, i) => (
        <div
          key={r.teamName}
          className={`grid ${COLS} items-center border-b border-divider px-5 py-[11px] last:border-b-0`}
        >
          <div className="font-mono text-[14px] font-semibold text-ink">
            {i + 1}
          </div>
          <div className="font-serif text-[15px] font-medium text-ink">
            {r.teamName}
          </div>
          <div className="text-right font-mono text-[14px] font-semibold text-ink">
            {displayPoints(r.points)}
          </div>
        </div>
      ))}
    </div>
  );
}
