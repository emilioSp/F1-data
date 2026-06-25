import type { DriverRaceInfoList } from '../api_types/driver_race_info.ts';
import type { RaceTimingData } from '../api_types/race_timing_data.ts';
import type { SessionInfo } from '../api_types/session_info.ts';
import type { WeatherData } from '../api_types/weather_data.ts';
import fetch from '../fetch.ts';
import RaceResultsRepository from '../repository/race_results.repository.ts';
import SessionsRepository from '../repository/sessions.repository.ts';
import type { RaceResult, Session } from '../types.ts';
import { getGMTOffset } from '../utils/getGMTOffset.ts';

type StoreRaceInput = {
  gpId: number;
  racePath: string;
  racingNumberToDriverId: Map<string, string>;
  isSprint: boolean;
};

const RaceService = {
  storeRace: async ({
    gpId,
    racePath,
    racingNumberToDriverId,
    isSprint,
  }: StoreRaceInput): Promise<[Session, RaceResult[]]> => {
    const raceWeather = await fetch<WeatherData>(`${racePath}WeatherData.json`);
    const raceInfo = await fetch<SessionInfo>(`${racePath}SessionInfo.json`);

    const raceEvent = await SessionsRepository.upsert({
      id: raceInfo.Key,
      type: isSprint ? 'sprint' : 'race',
      gp_id: gpId,
      start_date: `${raceInfo.StartDate}${getGMTOffset(raceInfo.GmtOffset)}`,
      start_date_local: `${raceInfo.StartDate}`,
      end_date: `${raceInfo.EndDate}${getGMTOffset(raceInfo.GmtOffset)}`,
      end_date_local: `${raceInfo.EndDate}`,
      gmt_offset: getGMTOffset(raceInfo.GmtOffset),
      air_temp: Number(raceWeather.AirTemp),
      track_temp: Number(raceWeather.TrackTemp),
      humidity: Number(raceWeather.Humidity),
    });

    const driverRaceInfoList = await fetch<DriverRaceInfoList>(
      `${racePath}DriverRaceInfo.json`,
    );

    const raceTiming = await fetch<RaceTimingData>(
      `${racePath}TimingDataF1.json`,
    );

    const raceResults = [];
    for (const [racingNumber, line] of Object.entries(raceTiming.Lines)) {
      const driverId = racingNumberToDriverId.get(racingNumber);
      if (!driverId) {
        throw new Error(
          `Driver ID not found for racing number: ${racingNumber}, racePath: ${racePath}`,
        );
      }

      const driverRaceInfo = driverRaceInfoList[racingNumber];
      if (!driverRaceInfo) {
        throw new Error(
          `Driver race info not found for racing number: ${racingNumber}, racePath: ${racePath}`,
        );
      }

      const result = await RaceResultsRepository.upsert({
        session_id: raceEvent.id,
        driver_id: driverId,
        position: Number(line.Position),
        best_laptime: line.BestLapTime.Value || null,
        gap_to_leader: line.GapToLeader || null,
        gap_to_position_ahead: line.IntervalToPositionAhead.Value || null,
        dnf: driverRaceInfo.IsOut,
        number_of_pit_stops: line.NumberOfPitStops ?? 0,
      });
      raceResults.push(result);
    }

    return [raceEvent, raceResults];
  },
};

export default RaceService;
