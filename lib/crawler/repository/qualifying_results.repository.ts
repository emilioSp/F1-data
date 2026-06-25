import db from '../../db.ts';
import type { QualifyingResult } from '../types.ts';

const TABLE_NAME = 'qualifying_results';

const QualifyingResultsRepository = {
  upsert: async (result: Omit<QualifyingResult, 'id'>) => {
    try {
      const [row] = await db<QualifyingResult>(TABLE_NAME)
        .insert(result)
        .onConflict(['session_id', 'driver_id'])
        .merge()
        .returning('*');
      return row;
    } catch (err) {
      console.error(JSON.stringify(result, null, 2));
      throw err;
    }
  },
};

export default QualifyingResultsRepository;
