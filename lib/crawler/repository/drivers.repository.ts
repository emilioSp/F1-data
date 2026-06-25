import db from '../../db.ts';
import type { Driver } from '../types.ts';

const TABLE_NAME = 'drivers';

const DriversRepository = {
  upsert: async (driver: Driver): Promise<Driver & { id: string }> => {
    const [row] = await db<Driver & { id: string }>(TABLE_NAME)
      .insert(driver)
      .onConflict(['name', 'team_name'])
      .merge()
      .returning('*');

    return row;
  },
};

export default DriversRepository;
