'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AVAILABLE_SEASONS } from '@/lib/years';

export default function YearSelector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const year = searchParams.get('year') ?? currentYear;
  return (
    <select
      value={year}
      onChange={(e) => router.push(`?year=${e.target.value}`)}
    >
      {AVAILABLE_SEASONS.map((y) => (
        <option key={y}>{y}</option>
      ))}
    </select>
  );
}
