import type { Metadata } from 'next';
import GPSummary from '@/app/components/GPSummary';
import Logo from '@/app/components/Logo';
import YearSelector from '@/app/components/YearSelector';
import GPSummaryRepository from '@/app/repository/gp_summary.repository';
import { AVAILABLE_SEASONS } from '@/lib/years';

export async function generateMetadata(
  props: PageProps<'/'>,
): Promise<Metadata> {
  const year =
    ((await props.searchParams)?.year as string) ?? AVAILABLE_SEASONS.at(-1);

  return {
    // Next.js doesn't apply the root layout's title template to the index
    // route (`/`) itself, only to nested routes — compose the full title here.
    title: `${year} Season — gpdata`,
    description: `Full ${year} Formula 1 Grand Prix calendar — race winners, pole positions, and weather for every round.`,
  };
}

const getGPSummary = async (season: number) => {
  const gpSummaries = await GPSummaryRepository.get(season.toString());

  // If season is the last one, show GP in a reverse order
  if (season === AVAILABLE_SEASONS.at(-1)) {
    return gpSummaries.reverse();
  }

  return gpSummaries;
};

export default async function SeasonPage(props: PageProps<'/'>) {
  const year = Number(
    (await props.searchParams)?.year ?? AVAILABLE_SEASONS.at(-1),
  );
  const today = new Date();
  const isCurrent = today.getFullYear() === year;

  const gpSummaries = await getGPSummary(year);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b border-border bg-cream/86 backdrop-blur-[10px]">
        <div className="mx-auto grid max-w-[1300px] grid-cols-[auto_1fr_auto] items-end gap-6 px-8 py-[18px]">
          <Logo size={44} />
          <div>
            <div className="text-[11px] font-sans font-semibold tracking-[.26em] text-red">
              FORMULA 1
            </div>
            <div className="mt-[6px] text-[30px] font-serif font-semibold leading-none text-ink">
              {year} Season{' '}
              {!isCurrent && (
                <span className="font-normal text-faint">Archive</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-[auto_auto] items-center gap-[10px]">
            <span className="text-[11px] font-sans font-medium tracking-[.14em] text-muted">
              SEASON
            </span>
            <span className="text-[15px] font-serif font-semibold text-ink">
              <YearSelector />
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1300px] px-4 pb-20 pt-[26px]">
        <div className="grid gap-[18px] grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
          {gpSummaries.map((row) => (
            <GPSummary key={`${row.id}-${row.type}`} gpSummary={row} />
          ))}
        </div>
      </main>
    </div>
  );
}
