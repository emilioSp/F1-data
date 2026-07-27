import type { GPDriversStandings } from '@/app/types';
import { DB_SESSION_TYPES } from '@/lib/crawler/types';
import db from '@/lib/db';

type GpStandingsInput = {
  gpId: number;
  isSprint: boolean;
};

const GPStandingsRepository = {
  getSessionDriversStandings: async ({ gpId, isSprint }: GpStandingsInput) => {
    const queryBuilder = db
      .select<GPDriversStandings[]>(
        'd.racing_number',
        db.raw('initcap(d.name) as driver_name'),
        'ds.points',
        'd.headshot_url',
        'd.team_name',
        'd.team_color',
      )
      .from('drivers_standings as ds')
      .innerJoin('drivers as d', 'd.id', 'ds.driver_id')
      .innerJoin('sessions as s', 's.id', 'ds.session_id')
      .innerJoin('grands_prix as gp', 'gp.id', 's.gp_id')
      .where('gp.id', gpId)
      .orderBy('ds.points', 'DESC');

    isSprint
      ? queryBuilder.where('s.type', DB_SESSION_TYPES.SPRINT)
      : queryBuilder.where('s.type', DB_SESSION_TYPES.RACE);

    const rows = await queryBuilder;
    return rows;
  },
};

export default GPStandingsRepository;
