import Image from 'next/image';
import { getHeadshotUrl } from '@/lib/images';

export default function Driver({
  driverName,
  racingNumber,
  teamName,
  teamColor,
  headshotUrl,
  dnf = false,
}: {
  driverName: string;
  racingNumber: number;
  teamName: string;
  teamColor: string;
  headshotUrl: string;
  dnf?: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[3px_auto_1fr] items-center gap-x-[11px] gap-y-[2px]">
      <span
        className="row-span-2 h-[34px] w-[3px] rounded-[2px]"
        style={{ background: `#${teamColor}` }}
      />
      <Image
        src={getHeadshotUrl(headshotUrl)}
        alt={driverName}
        width={48}
        height={48}
        className="row-span-2 h-[48px] w-[48px] rounded-full border border-card-border bg-cream object-cover"
      />
      <span
        className={`overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[15px] font-medium ${dnf ? 'text-muted' : 'text-ink'}`}
      >
        {driverName}
      </span>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-faint">
        #{racingNumber} · {teamName}
      </span>
    </div>
  );
}
