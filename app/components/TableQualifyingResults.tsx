import Driver from '@/app/components/Driver';
import type { GPDetailsQualifyingResults } from '@/app/types';

const COLS = 'grid-cols-[40px_1fr_110px_110px_110px]';

export default function TableQualifyingResults({
  results,
}: {
  results: GPDetailsQualifyingResults[];
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-card-border bg-card">
      <div className="min-w-[640px]">
        <div
          className={`grid ${COLS} items-center border-b border-divider px-5 py-[13px] text-[10px] font-sans font-medium tracking-[.14em] text-faint`}
        >
          <div>POS</div>
          <div>DRIVER</div>
          <div className="text-right">Q1</div>
          <div className="text-right">Q2</div>
          <div className="text-right">Q3</div>
        </div>
        {results.map((r) => (
          <div
            key={`${r.driverName}-${r.teamName}`}
            className={`grid ${COLS} items-center border-b border-divider px-5 py-[11px] last:border-b-0`}
          >
            <div className="font-mono text-[14px] font-semibold text-ink">
              {r.position}
            </div>
            <Driver
              driverName={r.driverName}
              racingNumber={r.racingNumber}
              teamName={r.teamName}
              teamColor={r.teamColor}
            />
            <div
              className={`text-right font-mono text-[13px] ${r.q1Time ? 'text-taupe' : 'text-faint'}`}
            >
              {r.q1Time ?? '—'}
            </div>
            <div
              className={`text-right font-mono text-[13px] ${r.q2Time ? 'text-taupe' : 'text-faint'}`}
            >
              {r.q2Time ?? '—'}
            </div>
            <div
              className={`text-right font-mono text-[13px] font-medium ${r.q3Time ? 'text-ink' : 'text-faint'}`}
            >
              {r.q3Time ?? '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
