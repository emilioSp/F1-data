export default function Driver({
  driverName,
  racingNumber,
  teamName,
  teamColor,
  dnf = false,
}: {
  driverName: string;
  racingNumber: number;
  teamName: string;
  teamColor: string;
  dnf?: boolean;
}) {
  return (
    <div className="grid grid-cols-[5px_auto] items-center gap-x-[11px] gap-y-[2px] min-w-0 min-[950px]:grid-cols-[5px_minmax(100px,300px)_auto] min-[950px]:gap-[11px]">
      <span
        className="col-start-1 row-start-1 row-span-2 h-[22px] w-[3px] shrink-0 rounded-[2px] min-[950px]:row-span-1"
        style={{ background: `#${teamColor}` }}
      />
      <span
        className={`col-start-2 row-start-1 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[15px] font-medium ${dnf ? 'text-muted' : 'text-ink'}`}
      >
        {driverName}
      </span>
      <span className="col-start-2 row-start-2 font-mono text-[11px] text-faint min-[950px]:col-start-3 min-[950px]:row-start-1">
        #{racingNumber} · {teamName}
      </span>
    </div>
  );
}
