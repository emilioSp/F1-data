import GPDetailView from '@/app/components/GPDetailView';
import GPDetailsRepository from '@/app/repository/gp_details.repository';
import { DB_SESSION_TYPES } from '@/lib/crawler/types';

export default async function GPDetailPage(props: PageProps<'/gp/[key]'>) {
  const { key } = await props.params;
  const [idStr, type] = key.split('-');
  const gpId = Number(idStr);
  const isSprint = type === 'sprint';

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
    GPDetailsRepository.getSessionDetails({
      gpId,
      sessionType: isSprint ? DB_SESSION_TYPES.SPRINT : DB_SESSION_TYPES.RACE,
    }),
    GPDetailsRepository.getSprintQualifyingResults({ gpId, isSprint }),
    GPDetailsRepository.getRaceResults({ gpId, isSprint }),
  ]);

  if (!qualifyingSessionDetails || !raceSessionDetails) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1300px] px-8 py-[26px]">
      <a
        href={`/?year=${raceSessionDetails.year}`}
        className="mb-[22px] inline-block font-sans font-medium text-red"
        style={{ fontSize: '13px' }}
      >
        ← All Grands Prix
      </a>

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
