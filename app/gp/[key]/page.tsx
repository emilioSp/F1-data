import type { Metadata } from 'next';
import GPDetailView from '@/app/components/GPDetailView';
import Logo from '@/app/components/Logo';
import GPDetailsRepository, {
  getCachedSessionDetails,
} from '@/app/repository/gp_details.repository';
import { DB_SESSION_TYPES } from '@/lib/crawler/types';

function parseKey(key: string) {
  const [idStr, type] = key.split('-');
  const gpId = Number(idStr);
  const isSprint = type === 'sprint';
  return { gpId, isSprint };
}

export async function generateMetadata(
  props: PageProps<'/gp/[key]'>,
): Promise<Metadata> {
  const { key } = await props.params;
  const { gpId, isSprint } = parseKey(key);

  const raceSessionDetails = await getCachedSessionDetails(
    gpId,
    isSprint ? DB_SESSION_TYPES.SPRINT : DB_SESSION_TYPES.RACE,
  );

  if (!raceSessionDetails) {
    return { title: 'Grand Prix' };
  }

  return {
    title: `${raceSessionDetails.name} ${raceSessionDetails.year}`,
    description: `${raceSessionDetails.officialName} — qualifying (Q1/Q2/Q3) and race results, weather, and timing.`,
  };
}

export default async function GPDetailPage(props: PageProps<'/gp/[key]'>) {
  const { key } = await props.params;
  const { gpId, isSprint } = parseKey(key);

  const [
    qualifyingSessionDetails,
    raceSessionDetails,
    qualifyingResults,
    raceResults,
  ] = await Promise.all([
    GPDetailsRepository.getSessionDetails({
      gpId,
      sessionType: isSprint
        ? DB_SESSION_TYPES.SPRINT_QUALIFYING
        : DB_SESSION_TYPES.QUALIFYING,
    }),
    getCachedSessionDetails(
      gpId,
      isSprint ? DB_SESSION_TYPES.SPRINT : DB_SESSION_TYPES.RACE,
    ),
    GPDetailsRepository.getSprintQualifyingResults({ gpId, isSprint }),
    GPDetailsRepository.getRaceResults({ gpId, isSprint }),
  ]);

  if (!qualifyingSessionDetails) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1300px] px-8 py-[26px]">
      <div className="mb-[22px] grid grid-cols-[auto_1fr] items-center gap-[14px]">
        <Logo size={34} />
        <a
          href={`/?year=${qualifyingSessionDetails.year}`}
          className="font-sans font-medium text-red"
          style={{ fontSize: '13px' }}
        >
          ← All Grands Prix
        </a>
      </div>

      <GPDetailView
        qualifyingSessionDetails={qualifyingSessionDetails}
        raceSessionDetails={raceSessionDetails}
        qualifyingResults={qualifyingResults}
        raceResults={raceResults}
        isSprint={isSprint}
      />
    </div>
  );
}
