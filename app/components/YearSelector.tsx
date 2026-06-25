'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/years';

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
      {AVAILABLE_YEARS.map((y) => (
        <option key={y}>{y}</option>
      ))}
    </select>
  );
}
