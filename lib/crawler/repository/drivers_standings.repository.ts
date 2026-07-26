import db from '../../db.ts';
import type { DriverStanding } from '../types.ts';

const TABLE_NAME = 'drivers_standings';

const DriversStandingsRepository = {
  upsert: async (driverStanding: DriverStanding): Promise<DriverStanding> => {
    try {
      const [row] = await db(TABLE_NAME)
        .insert(driverStanding)
        .onConflict(['session_id', 'driver_id'])
        .merge()
        .returning('*');
      return row;
    } catch (e) {
      console.error(JSON.stringify(driverStanding, null, 2));
      throw e;
    }
  },
};

export default DriversStandingsRepository;
