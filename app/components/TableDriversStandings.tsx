import Driver from '@/app/components/Driver';
import type { GPDriversStandings } from '@/app/types';
import { displayPoints } from '@/app/utils/points';

const COLS = 'grid-cols-[40px_1fr_76px]';

export default function TableDriversStandings({
  results,
}: {
  results: GPDriversStandings[];
}) {
  return (
    <div className="rounded-[8px] border border-card-border bg-card">
      <div
        className={`grid ${COLS} items-center border-b border-divider px-5 py-[13px] text-[10px] font-sans font-medium tracking-[.14em] text-faint`}
      >
        <div>POS</div>
        <div>DRIVER</div>
        <div className="text-right">POINTS</div>
      </div>
      {results.map((r, i) => (
        <div
          key={`${r.driverName}-${r.teamName}`}
          className={`grid ${COLS} items-center border-b border-divider px-5 py-[11px] last:border-b-0`}
        >
          <div className="font-mono text-[14px] font-semibold text-ink">
            {i + 1}
          </div>
          <Driver
            driverName={r.driverName}
            racingNumber={r.racingNumber}
            teamName={r.teamName}
            teamColor={r.teamColor}
            headshotUrl={r.headshotUrl}
          />
          <div className="text-right font-mono text-[14px] font-semibold text-ink">
            {displayPoints(r.points)}
          </div>
        </div>
      ))}
    </div>
  );
}
