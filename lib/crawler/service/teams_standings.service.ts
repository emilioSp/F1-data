import type { ChampionshipPrediction } from '../api_types/championship_prediction.ts';
import fetch from '../fetch.ts';
import TeamsStandingsRepository from '../repository/teams_standings.repository.ts';

type StoreTeamsStandingsInput = {
  session_id: number;
  racePath: string;
};

const TeamsStandingsService = {
  storeTeamsStandings: async ({
    session_id,
    racePath,
  }: StoreTeamsStandingsInput): Promise<void> => {
    const prediction = await fetch<ChampionshipPrediction>(
      `${racePath}ChampionshipPrediction.json`,
    );

    for (const team of Object.values(prediction.Teams)) {
      await TeamsStandingsRepository.upsert({
        team_name: team.TeamName,
        points: Math.floor(team.PredictedPoints), // api can return decimal points. I have no words.
        session_id,
      });
    }
  },
};

export default TeamsStandingsService;
