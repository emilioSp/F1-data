import type { WeatherSource } from '@/app/types';

type Weather = {
  airTemp: string;
  trackTemp: string;
  humidity: string;
};

export function pickWeather(
  race: {
    airTemp: string | null;
    trackTemp: string | null;
    humidity: string | null;
  },
  quali: Weather,
): Weather & { source: WeatherSource } {
  if (race.airTemp != null && race.trackTemp != null && race.humidity != null) {
    return {
      airTemp: race.airTemp,
      trackTemp: race.trackTemp,
      humidity: race.humidity,
      source: 'race',
    };
  }

  return { ...quali, source: 'qualifying' };
}
