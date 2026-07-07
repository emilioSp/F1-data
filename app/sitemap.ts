import type { MetadataRoute } from 'next';
import GPSummaryRepository from '@/app/repository/gp_summary.repository';
import { SITE_URL } from '@/lib/site';
import { AVAILABLE_SEASONS } from '@/lib/years';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keys = await GPSummaryRepository.getAllKeys();
  const latestSeason = AVAILABLE_SEASONS.at(-1);

  const seasonEntries: MetadataRoute.Sitemap = AVAILABLE_SEASONS.filter(
    (year) => year !== latestSeason,
  ).map((year) => ({
    url: `${SITE_URL}/?year=${year}`,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const gpEntries: MetadataRoute.Sitemap = keys.map((entry) => ({
    url: `${SITE_URL}/gp/${entry.id}-${entry.type}`,
    lastModified: entry.startDate,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...seasonEntries,
    ...gpEntries,
  ];
}
