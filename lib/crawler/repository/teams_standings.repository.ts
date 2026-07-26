import db from '../../db.ts';
import type { TeamStanding } from '../types.ts';

const TABLE_NAME = 'teams_standings';

const TeamsStandingsRepository = {
  upsert: async (teamStanding: TeamStanding): Promise<TeamStanding> => {
    try {
      const [row] = await db(TABLE_NAME)
        .insert(teamStanding)
        .onConflict(['session_id', 'team_name'])
        .merge()
        .returning('*');
      return row;
    } catch (e) {
      console.error(JSON.stringify(teamStanding, null, 2));
      throw e;
    }
  },
};

export default TeamsStandingsRepository;
