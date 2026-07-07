import db from '../../db.ts';
import type { GrandPrix } from '../types.ts';

const TABLE_NAME = 'grands_prix';

type GrandPrixRow = {
  id: number;
  number: number;
  year: number;
  official_name: string;
  name: string;
  circuit_name: string;
  country_code: string;
  location: string;
  sprint_qualifying_path?: string;
  sprint_path?: string;
  qualifying_path: string;
  race_path: string;
};

const GrandsPrixRepository = {
  upsert: async (gp: GrandPrixRow): Promise<GrandPrix> => {
    try {
      const [row] = await db(TABLE_NAME)
        .insert(gp)
        .onConflict(['id'])
        .merge()
        .returning('*');
      return row as GrandPrix;
    } catch (e) {
      console.error(JSON.stringify(gp, null, 2));
      throw e;
    }
  },
};

export default GrandsPrixRepository;
