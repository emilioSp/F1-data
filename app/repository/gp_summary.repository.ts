import type { GpSummary } from '@/app/types';
import db from '@/lib/db';

const GPSummaryRepository = {
  get: async (year: string): Promise<GpSummary[]> => {
    const rows = (await db
      .select(
        'gp.id',
        'gp.name',
        'gp.number',
        'gp.official_name',
        'gp.location',
        'gp.circuit_name',
        'gp.country_code',
        'gp.year',
        's_race.type',
        's_race.start_date as race_date',
        's_race.air_temp as race_air_temp',
        's_race.track_temp as race_track_temp',
        's_race.humidity as race_humidity',
        db.raw('initcap(d_winner.name) as winner_name'),
        'd_winner.team_name as winner_team',
        'd_winner.team_color as winner_team_color',
        db.raw('initcap(d_pole.name) as pole_name'),
        'd_pole.team_name as pole_team',
        'd_pole.team_color as pole_team_color',
      )
      .from('grands_prix as gp')
      .leftJoin('sessions as s_race', function () {
        this.on('s_race.gp_id', '=', 'gp.id').andOn(
          's_race.type',
          '=',
          db.raw("'race'"),
        );
      })
      .leftJoin('race_results as r', function () {
        this.on('r.session_id', '=', 's_race.id').andOn(
          'r.position',
          '=',
          db.raw('1'),
        );
      })
      .leftJoin('drivers as d_winner', 'd_winner.id', 'r.driver_id')
      .leftJoin('sessions as s_quali', function () {
        this.on('s_quali.gp_id', '=', 'gp.id').andOn(
          's_quali.type',
          '=',
          db.raw("'qualifying'"),
        );
      })
      .leftJoin('qualifying_results as q', function () {
        this.on('q.session_id', '=', 's_quali.id').andOn(
          'q.position',
          '=',
          db.raw('1'),
        );
      })
      .leftJoin('drivers as d_pole', 'd_pole.id', 'q.driver_id')
      .where('gp.year', year)
      .union(function () {
        this.select(
          'gp.id',
          'gp.name',
          'gp.number',
          'gp.official_name',
          'gp.location',
          'gp.circuit_name',
          'gp.country_code',
          'gp.year',
          's_race.type',
          's_race.start_date as race_date',
          's_race.air_temp as race_air_temp',
          's_race.track_temp as race_track_temp',
          's_race.humidity as race_humidity',
          db.raw('initcap(d_winner.name) as winner_name'),
          'd_winner.team_name as winner_team',
          'd_winner.team_color as winner_team_color',
          db.raw('initcap(d_pole.name) as pole_name'),
          'd_pole.team_name as pole_team',
          'd_pole.team_color as pole_team_color',
        )
          .from('grands_prix as gp')
          .leftJoin('sessions as s_race', function () {
            this.on('s_race.gp_id', '=', 'gp.id').andOn(
              's_race.type',
              '=',
              db.raw("'sprint'"),
            );
          })
          .leftJoin('race_results as r', function () {
            this.on('r.session_id', '=', 's_race.id').andOn(
              'r.position',
              '=',
              db.raw('1'),
            );
          })
          .leftJoin('drivers as d_winner', 'd_winner.id', 'r.driver_id')
          .leftJoin('sessions as s_quali', function () {
            this.on('s_quali.gp_id', '=', 'gp.id').andOn(
              's_quali.type',
              '=',
              db.raw("'sprint_qualifying'"),
            );
          })
          .leftJoin('qualifying_results as q', function () {
            this.on('q.session_id', '=', 's_quali.id').andOn(
              'q.position',
              '=',
              db.raw('1'),
            );
          })
          .leftJoin('drivers as d_pole', 'd_pole.id', 'q.driver_id')
          .where('gp.year', year)
          .whereNotNull('s_race.start_date');
      })
      .orderBy('number')
      .orderBy('race_date')) as unknown as GpSummary[];

    if (rows.length === 0) {
      throw new Error('No GP found.');
    }
    return rows;
  },
};

export default GPSummaryRepository;
