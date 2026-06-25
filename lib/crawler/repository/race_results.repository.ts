import db from '../../db.ts';
import type { RaceResult } from '../types.ts';

const TABLE_NAME = 'race_results';

const RaceResultsRepository = {
  upsert: async (result: Omit<RaceResult, 'id'>) => {
    const [row] = await db<RaceResult>(TABLE_NAME)
      .insert(result)
      .onConflict(['session_id', 'driver_id'])
      .merge()
      .returning('*');
    return row;
  },
};

export default RaceResultsRepository;
