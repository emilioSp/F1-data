import type { QualifyingTimingData } from '../api_types/qualifying_timing_data.ts';
import type { SessionInfo } from '../api_types/session_info.ts';
import type { WeatherData } from '../api_types/weather_data.ts';
import fetch from '../fetch.ts';
import QualifyingResultsRepository from '../repository/qualifying_results.repository.ts';
import SessionsRepository from '../repository/sessions.repository.ts';
import type { QualifyingResult, Session } from '../types.ts';
import { getGMTOffset } from '../utils/getGMTOffset.ts';

type StoreQualifyingInput = {
  gpId: number;
  qualifyingPath: string;
  racingNumberToDriverId: Map<string, string>;
  isSprint: boolean;
};

const QualifyingService = {
  storeQualifying: async ({
    gpId,
    qualifyingPath,
    racingNumberToDriverId,
    isSprint,
  }: StoreQualifyingInput): Promise<[Session, QualifyingResult[]]> => {
    const qualifyingWeather = await fetch<WeatherData>(
      `${qualifyingPath}WeatherData.json`,
    );
    const qualifyingInfo = await fetch<SessionInfo>(
      `${qualifyingPath}SessionInfo.json`,
    );

    const qualifyingEvent = await SessionsRepository.upsert({
      id: qualifyingInfo.Key,
      type: isSprint ? 'sprint_qualifying' : 'qualifying',
      gp_id: gpId,
      start_date: `${qualifyingInfo.StartDate}${getGMTOffset(qualifyingInfo.GmtOffset)}`,
      start_date_local: qualifyingInfo.StartDate,
      end_date: `${qualifyingInfo.EndDate}${getGMTOffset(qualifyingInfo.GmtOffset)}`,
      end_date_local: qualifyingInfo.EndDate,
      gmt_offset: getGMTOffset(qualifyingInfo.GmtOffset),
      air_temp: Number(qualifyingWeather.AirTemp),
      track_temp: Number(qualifyingWeather.TrackTemp),
      humidity: Number(qualifyingWeather.Humidity),
    });

    const qualifyingTiming = await fetch<QualifyingTimingData>(
      `${qualifyingPath}TimingDataF1.json`,
    );

    const qualifyingResults = [];
    for (const [racingNumber, line] of Object.entries(qualifyingTiming.Lines)) {
      const driverId = racingNumberToDriverId.get(racingNumber);
      if (!driverId) {
        throw new Error(
          `Driver ID not found for racing number: ${racingNumber}, qualifyingPath: ${qualifyingPath}`,
        );
      }

      const result = await QualifyingResultsRepository.upsert({
        session_id: qualifyingEvent.id,
        driver_id: driverId,
        position: Number(line.Position),
        q1_time: line.BestLapTimes[0]?.Value || null,
        q2_time: line.BestLapTimes[1]?.Value || null,
        q3_time: line.BestLapTimes[2]?.Value || null,
        knocked_out: line.KnockedOut,
      });

      qualifyingResults.push(result);
    }

    return [qualifyingEvent, qualifyingResults];
  },
};

export default QualifyingService;
