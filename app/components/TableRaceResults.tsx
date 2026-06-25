import Driver from '@/app/components/Driver';
import type { GPDetailsRaceResults } from '@/app/types';

const COLS = 'grid-cols-[40px_1fr_100px_100px_120px_70px]';

export default function TableRaceResults({
  results,
}: {
  results: GPDetailsRaceResults[];
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-card-border bg-card">
      <div className="min-w-[700px]">
        <div
          className={`grid ${COLS} items-center border-b border-divider px-5 py-[13px] text-[10px] font-sans font-medium tracking-[.14em] text-faint`}
        >
          <div>POS</div>
          <div>DRIVER</div>
          <div className="text-right">GAP</div>
          <div className="text-right">INTERVAL</div>
          <div className="text-right">BEST LAP</div>
          <div className="text-right">PITS</div>
        </div>
        {results.map((r) => (
          <div
            key={`${r.driverName}-${r.teamName}`}
            className={`grid ${COLS} items-center border-b border-divider px-5 py-[11px] last:border-b-0`}
          >
            <div
              className={`font-mono text-[14px] font-semibold ${r.dnf ? 'text-red' : 'text-ink'}`}
            >
              {r.dnf ? 'DNF' : r.position}
            </div>
            <Driver
              driverName={r.driverName}
              racingNumber={r.racingNumber}
              teamName={r.teamName}
              teamColor={r.teamColor}
              dnf={r.dnf}
            />
            <div className="text-right font-mono text-[13px] text-dark">
              {r.gapToLeader}
            </div>
            <div className="text-right font-mono text-[13px] text-taupe">
              {r.gapToPositionAhead}
            </div>
            <div className="text-right font-mono text-[13px] text-taupe">
              {r.bestLaptime}
            </div>
            <div className="text-right font-mono text-[13px] text-taupe">
              {r.numberOfPitStops}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
