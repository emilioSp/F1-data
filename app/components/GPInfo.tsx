import { fmtDate } from '@/app/utils/date';
import { getFlag } from '@/app/utils/flags';

export default function GPInfo({
  number,
  isSprint,
  officialName,
  name,
  location,
  countryCode,
  date,
}: {
  number: number;
  isSprint: boolean;
  officialName: string;
  name: string;
  location: string;
  countryCode: string;
  date: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[80px_auto] items-center gap-[10px]">
        <span className="text-[11px] font-sans font-medium tracking-[.18em] text-faint">
          ROUND {String(number).padStart(2, '0')}
        </span>
        {isSprint ? (
          <span className="inline-flex w-fit items-center whitespace-nowrap rounded-[3px] bg-red text-[9px] font-sans font-semibold tracking-[.14em] text-cream px-1.5 py-0.5">
            SPRINT
          </span>
        ) : (
          <span className="inline-flex w-fit items-center whitespace-nowrap rounded-[3px] border border-border text-[9px] font-sans font-semibold tracking-[.14em] text-muted px-1.5 py-0.5">
            GRAND PRIX
          </span>
        )}
      </div>

      <div className="text-[32px] font-serif font-semibold leading-[1.02] text-ink">
        {getFlag(countryCode)} {officialName}
      </div>

      <div className="text-[13px] font-sans text-subtle">{name}</div>

      <div className="text-[12px] font-mono font-medium text-taupe">
        {location} · {fmtDate(date)}
      </div>
    </div>
  );
}
