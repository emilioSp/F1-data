'use client';

import { useState } from 'react';
import GPInfo from '@/app/components/GPInfo';
import TableQualifyingResults from '@/app/components/TableQualifyingResults';
import TableRaceResults from '@/app/components/TableRaceResults';
import WeatherData from '@/app/components/WeatherData';
import type {
  GPDetailsQualifyingResults,
  GPDetailsRaceResults,
  GPSessionDetails,
} from '@/app/types';

type Tab = 'qualifying' | 'race';

export default function GPDetailView({
  qualifyingSessionDetails,
  raceSessionDetails,
  qualifyingResults,
  raceResults,
  isSprint,
}: {
  qualifyingSessionDetails: GPSessionDetails;
  raceSessionDetails?: GPSessionDetails;
  qualifyingResults: GPDetailsQualifyingResults[];
  raceResults: GPDetailsRaceResults[];
  isSprint: boolean;
}) {
  const hasRace = raceSessionDetails !== undefined;
  const [tab, setTab] = useState<Tab>(hasRace ? 'race' : 'qualifying');

  const activeSessionDetails =
    tab === 'race' && raceSessionDetails
      ? raceSessionDetails
      : qualifyingSessionDetails;
  const qualiLabel = isSprint ? 'Sprint Qualifying' : 'Qualifying';
  const raceLabel = isSprint ? 'Sprint' : 'Race';

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-6 min-[750px]:grid-cols-[1fr_auto]">
        <GPInfo
          number={activeSessionDetails.number}
          isSprint={isSprint}
          officialName={activeSessionDetails.officialName}
          name={activeSessionDetails.name}
          location={activeSessionDetails.location}
          countryCode={activeSessionDetails.countryCode}
          date={activeSessionDetails.startDate}
        />
        <WeatherData
          airTemp={activeSessionDetails.airTemp}
          trackTemp={activeSessionDetails.trackTemp}
          humidity={activeSessionDetails.humidity}
        />
      </div>

      <div className="mt-[30px]">
        <div className="grid grid-flow-col auto-cols-max gap-1 border-b border-divider">
          <TabButton
            active={tab === 'qualifying'}
            onClick={() => setTab('qualifying')}
          >
            {qualiLabel}
          </TabButton>
          <TabButton
            active={tab === 'race'}
            disabled={!hasRace}
            onClick={() => setTab('race')}
          >
            {raceLabel}
          </TabButton>
        </div>

        <div className="mt-[22px]">
          {tab === 'qualifying' ? (
            <TableQualifyingResults results={qualifyingResults} />
          ) : (
            <TableRaceResults results={raceResults} />
          )}
        </div>
      </div>
    </>
  );
}

function TabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`px-[18px] pb-[11px] font-sans text-[13px] tracking-[.02em] ${
        disabled
          ? 'cursor-not-allowed border-b-2 border-transparent font-medium text-faint'
          : active
            ? 'border-b-2 border-red font-semibold text-ink'
            : 'border-b-2 border-transparent font-medium text-muted'
      }`}
    >
      {children}
    </button>
  );
}
