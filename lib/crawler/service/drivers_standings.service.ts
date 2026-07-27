import type { ChampionshipPrediction } from '../api_types/championship_prediction.ts';
import fetch from '../fetch.ts';
import DriversStandingsRepository from '../repository/drivers_standings.repository.ts';

type StoreDriversStandingsInput = {
  session_id: number;
  racePath: string;
  racingNumberToDriverId: Map<string, string>;
};

const DriversStandingsService = {
  storeDriversStandings: async ({
    session_id,
    racePath,
    racingNumberToDriverId,
  }: StoreDriversStandingsInput): Promise<void> => {
    const prediction = await fetch<ChampionshipPrediction>(
      `${racePath}ChampionshipPrediction.json`,
    );

    for (const [racingNumber, driverId] of racingNumberToDriverId.entries()) {
      if (prediction.Drivers[racingNumber] !== undefined) {
        // public api are not reliable :(
        await DriversStandingsRepository.upsert({
          driver_id: driverId,
          points: prediction.Drivers[racingNumber].PredictedPoints,
          session_id,
        });
      }
    }
  },
};

export default DriversStandingsService;
