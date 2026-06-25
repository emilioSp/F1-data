import type {
  GPDetailsQualifyingResults,
  GPDetailsRaceResults,
  GPSessionDetails,
} from '@/app/types';
import type { DB_SESSION_TYPES } from '@/lib/crawler/types';
import db from '@/lib/db';

type GpDetailsInput = {
  gpId: number;
  isSprint: boolean;
};

type GpSessionDetailsInput = {
  gpId: number;
  sessionType: (typeof DB_SESSION_TYPES)[keyof typeof DB_SESSION_TYPES];
};

const GPDetailsRepository = {
  getSprintQualifyingResults: async ({ gpId, isSprint }: GpDetailsInput) => {
    const queryBuilder = db
      .select<GPDetailsQualifyingResults[]>(
        'qr.position',
        db.raw('initcap(d.name) as driver_name'),
        'd.racing_number',
        'd.team_name',
        'd.team_color',
        'qr.q1_time',
        'qr.q2_time',
        'qr.q3_time',
        'qr.knocked_out',
      )
      .from('grand_prixs as gp')
      .innerJoin('sessions as s', 's.gp_id', 'gp.id')
      .innerJoin('qualifying_results as qr', 'qr.session_id', 's.id')
      .innerJoin('drivers as d', 'd.id', 'qr.driver_id')
      .where('gp.id', gpId)
      .orderBy('qr.position');

    isSprint
      ? queryBuilder.where('s.type', 'sprint_qualifying')
      : queryBuilder.where('s.type', 'qualifying');

    const rows = await queryBuilder;
    return rows;
  },

  getRaceResults: async ({ gpId, isSprint }: GpDetailsInput) => {
    const queryBuilder = db
      .select<GPDetailsRaceResults[]>(
        'rr.position',
        db.raw('initcap(d.name) as driver_name'),
        'd.racing_number',
        'd.team_name',
        'd.team_color',
        'rr.best_laptime',
        db.raw(
          "CASE WHEN rr.position = 1 THEN 'LEADER' ELSE rr.gap_to_leader END as gap_to_leader",
        ),
        db.raw(
          "CASE WHEN rr.position = 1 THEN 'LEADER' ELSE rr.gap_to_position_ahead END as gap_to_position_ahead",
        ),
        'rr.dnf',
        'rr.number_of_pit_stops',
      )
      .from('grand_prixs as gp')
      .innerJoin('sessions as s', 's.gp_id', 'gp.id')
      .innerJoin('race_results as rr', 'rr.session_id', 's.id')
      .innerJoin('drivers as d', 'd.id', 'rr.driver_id')
      .where('gp.id', gpId)
      .orderBy('rr.position');

    isSprint
      ? queryBuilder.where('s.type', 'sprint')
      : queryBuilder.where('s.type', 'race');

    const rows = await queryBuilder;
    return rows;
  },

  getSessionDetails: async ({ gpId, sessionType }: GpSessionDetailsInput) => {
    return db
      .select<GPSessionDetails>(
        'gp.name',
        'gp.number',
        'gp.location',
        'gp.official_name',
        'gp.circuit_name',
        'gp.country_code',
        'gp.year',
        's.start_date',
        's.air_temp',
        's.track_temp',
        's.humidity',
      )
      .from('grand_prixs as gp')
      .innerJoin('sessions as s', 's.gp_id', 'gp.id')
      .where('gp.id', gpId)
      .where('s.type', sessionType)
      .first();
  },
};

export default GPDetailsRepository;
