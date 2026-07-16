import Image from 'next/image';
import Link from 'next/link';
import type { GpSummary } from '@/app/types';
import { fmtDate } from '@/app/utils/date';
import { getFlag } from '@/app/utils/flags';
import { pickWeather } from '@/app/utils/weather';
import { getHeadshotUrl } from '@/lib/images';

const isSprint = (type: GpSummary['type']) => type === 'sprint';

export default function GPSummary({ gpSummary }: { gpSummary: GpSummary }) {
  // `type` is null only when the race session doesn't exist yet — always the
  // non-sprint case (the sprint branch of the summary query only ever
  // returns rows once its sprint session exists).
  const type = gpSummary.type ?? 'race';
  const weather = pickWeather(
    {
      airTemp: gpSummary.raceAirTemp,
      trackTemp: gpSummary.raceTrackTemp,
      humidity: gpSummary.raceHumidity,
    },
    {
      airTemp: gpSummary.qualiAirTemp,
      trackTemp: gpSummary.qualiTrackTemp,
      humidity: gpSummary.qualiHumidity,
    },
  );

  return (
    <Link href={`/gp/${gpSummary.id}-${type}`} className="block h-full">
      <div className="f1-tile relative grid h-full cursor-pointer rounded-[8px] border border-card-border bg-card p-[20px_22px_18px]">
        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
          <div className="grid grid-cols-[1fr_2fr] auto-cols-auto items-center gap-[9px]">
            <span className="text-[11px] font-sans font-medium tracking-[.18em] text-faint">
              ROUND {String(gpSummary.number).padStart(2, '0')}
            </span>
            {isSprint(type) ? (
              <span className="inline-flex w-fit items-center whitespace-nowrap rounded-[3px] bg-red text-[9px] font-sans font-semibold tracking-[.14em] text-cream px-1.5 py-0.5">
                SPRINT
              </span>
            ) : (
              <span className="inline-flex w-fit items-center whitespace-nowrap rounded-[3px] border border-border text-[9px] font-sans font-semibold tracking-[.14em] text-muted px-1.5 py-0.5">
                GRAND PRIX
              </span>
            )}
          </div>
          <span className="text-[12px] font-sans font-medium text-subtle">
            {getFlag(gpSummary.countryCode)} {gpSummary.countryCode}
          </span>
        </div>

        {/* GP name + circuit */}
        <div className="mt-[13px] text-[18px] font-serif font-medium leading-[1.08] text-ink">
          {gpSummary.officialName}
        </div>
        <div className="mt-[5px] text-[12.5px] font-sans text-subtle">
          {gpSummary.name}
        </div>

        {/* Date + status */}
        <div className="mt-[11px] grid grid-cols-[auto_1fr] items-center gap-2">
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-green" />
          <span className="text-[11px] font-mono font-medium tracking-[.06em] text-taupe">
            {fmtDate(gpSummary.raceDate)}
          </span>
        </div>

        <div className="my-4 h-px bg-divider" />

        {/* WIN + POLE */}
        <div className="grid grid-cols-2 gap-[26px]">
          <DriverColumn
            label="WINNER"
            name={gpSummary.winnerName}
            team={gpSummary.winnerTeamName}
            color={gpSummary.winnerTeamColor}
            headshotUrl={gpSummary.winnerHeadshotUrl}
          />
          <DriverColumn
            label={isSprint(type) ? 'SPRINT POLE' : 'POLE'}
            name={gpSummary.poleName}
            team={gpSummary.poleTeamName}
            color={gpSummary.poleTeamColor}
            headshotUrl={gpSummary.poleHeadshotUrl}
          />
        </div>

        <div className="my-4 h-px bg-divider" />

        {/* Weather + View */}
        <div className="mt-auto grid grid-cols-[auto_1fr] items-end gap-[18px] pt-[14px]">
          <div className="grid grid-flow-col auto-cols-max items-end gap-[18px]">
            <WeatherCell
              label="AIR"
              value={`${Number(weather.airTemp).toFixed(1)} C°`}
              badge={
                weather.source === 'qualifying'
                  ? isSprint(type)
                    ? 'SPRINT QUALI'
                    : 'QUALI'
                  : undefined
              }
            />
            <WeatherCell
              label="TRACK"
              value={`${Number(weather.trackTemp).toFixed(1)} C°`}
            />
            <WeatherCell label="HUMIDITY" value={`${weather.humidity} %`} />
          </div>
          <div className="text-right text-[11px] font-sans font-medium text-red">
            View →
          </div>
        </div>
      </div>
    </Link>
  );
}

function DriverColumn({
  label,
  name,
  team,
  color,
  headshotUrl,
}: {
  label: string;
  name: string | null;
  team: string | null;
  color: string | null;
  headshotUrl: string | null;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-[6px] text-[9.5px] font-sans font-medium tracking-[.16em] text-faint">
        {label}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="grid grid-flow-col items-center gap-2">
          <span
            className="h-[28px] w-[3px] shrink-0 rounded-[2px]"
            style={{ background: color ? `#${color}` : undefined }}
          />
          {name && headshotUrl && (
            <Image
              src={getHeadshotUrl(headshotUrl)}
              alt={name}
              width={36}
              height={36}
              className="h-[36px] w-[36px] rounded-full border border-card-border bg-cream object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-serif font-medium text-ink">
            {name ?? 'N/A'}
          </div>
          {team && (
            <div className="text-[11px] font-sans text-subtle">{team}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherCell({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="grid grid-rows-[auto_auto_auto] gap-[2px]">
      {badge && (
        <span className="mb-[2px] inline-flex w-fit items-center whitespace-nowrap rounded-[3px] border border-border text-[8px] font-sans font-semibold tracking-[.14em] text-muted px-1 py-0.5">
          {badge}
        </span>
      )}
      <span className="text-[9px] font-sans font-medium tracking-[.12em] text-faint">
        {label}
      </span>
      <span className="text-[13px] font-mono font-medium text-dark">
        {value}
      </span>
    </div>
  );
}
