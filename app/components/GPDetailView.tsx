'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import GPInfo from '@/app/components/GPInfo';
import TableDriversStandings from '@/app/components/TableDriversStandings';
import TableQualifyingResults from '@/app/components/TableQualifyingResults';
import TableRaceResults from '@/app/components/TableRaceResults';
import TableTeamsStandings from '@/app/components/TableTeamsStandings';
import WeatherData from '@/app/components/WeatherData';
import type {
  GPDetailsQualifyingResults,
  GPDetailsRaceResults,
  GPDriversStandings,
  GPSessionDetails,
  GPTeamsStandings,
} from '@/app/types';

type Tab = 'qualifying' | 'race' | 'drivers' | 'teams';

const TABS: Tab[] = ['qualifying', 'race', 'drivers', 'teams'];

export default function GPDetailView({
  qualifyingSessionDetails,
  raceSessionDetails,
  qualifyingResults,
  raceResults,
  driversStandings,
  teamsStandings,
  isSprint,
}: {
  qualifyingSessionDetails: GPSessionDetails;
  raceSessionDetails?: GPSessionDetails;
  qualifyingResults: GPDetailsQualifyingResults[];
  raceResults: GPDetailsRaceResults[];
  driversStandings: GPDriversStandings[];
  teamsStandings: GPTeamsStandings[];
  isSprint: boolean;
}) {
  const hasRace = raceSessionDetails !== undefined;
  const hasDriversStandings = driversStandings.length > 0;
  const hasTeamsStandings = teamsStandings.length > 0;

  const searchParams = useSearchParams();
  const [tab, setTabState] = useState<Tab>(() => {
    const requestedTab = searchParams.get('tab');
    return TABS.includes(requestedTab as Tab)
      ? (requestedTab as Tab)
      : hasRace
        ? 'race'
        : 'qualifying';
  });

  // Update the URL via the raw History API rather than next/navigation's
  // router — router.push/replace triggers an RSC fetch that re-runs every
  // DB query in page.tsx, even though none of them depend on `tab`.
  const setTab = (next: Tab) => {
    setTabState(next);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', next);
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  const activeSessionDetails =
    tab !== 'qualifying' && raceSessionDetails
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
        <div className="flex flex-col items-start border-b border-divider min-[750px]:flex-row">
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
          <TabButton
            active={tab === 'drivers'}
            disabled={!hasDriversStandings}
            onClick={() => setTab('drivers')}
          >
            Drivers standings
          </TabButton>
          <TabButton
            active={tab === 'teams'}
            disabled={!hasTeamsStandings}
            onClick={() => setTab('teams')}
          >
            Teams standings
          </TabButton>
        </div>

        <div className="mt-[22px]">
          {tab === 'qualifying' ? (
            <TableQualifyingResults results={qualifyingResults} />
          ) : tab === 'race' ? (
            <TableRaceResults results={raceResults} />
          ) : tab === 'drivers' ? (
            <TableDriversStandings results={driversStandings} />
          ) : (
            <TableTeamsStandings results={teamsStandings} />
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
            ? 'cursor-pointer border-b-2 border-transparent font-semibold text-ink min-[750px]:border-red'
            : 'cursor-pointer border-b-2 border-transparent font-medium text-muted'
      }`}
    >
      {children}
    </button>
  );
}
