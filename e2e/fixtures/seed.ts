import DriversRepository from '../../lib/crawler/repository/drivers.repository.ts';
import GrandsPrixRepository from '../../lib/crawler/repository/grands_prix.repository.ts';
import QualifyingResultsRepository from '../../lib/crawler/repository/qualifying_results.repository.ts';
import RaceResultsRepository from '../../lib/crawler/repository/race_results.repository.ts';
import SessionsRepository from '../../lib/crawler/repository/sessions.repository.ts';
import { DB_SESSION_TYPES } from '../../lib/crawler/types.ts';
import db from '../../lib/db.ts';

// Season 1900 doesn't exist in AVAILABLE_SEASONS, so this fixture can never
// collide with real hydrated data.
const GP_ID = 1900000001;
const QUALIFYING_SESSION_ID = 1900000011;
const RACE_SESSION_ID = 1900000012;

async function seed() {
  await GrandsPrixRepository.upsert({
    id: GP_ID,
    number: 1,
    year: 1900,
    official_name: 'Test Grand Prix',
    name: 'Test GP',
    circuit_name: 'Test Circuit',
    country_code: 'XX',
    location: 'Testville',
    qualifying_path: '/test/qualifying/',
    race_path: '/test/race/',
  });

  const now = new Date().toISOString();
  const commonSessionFields = {
    gp_id: GP_ID,
    start_date: now,
    end_date: now,
    start_date_local: now,
    end_date_local: now,
    gmt_offset: '+00:00',
  };

  await SessionsRepository.upsert({
    id: QUALIFYING_SESSION_ID,
    type: DB_SESSION_TYPES.QUALIFYING,
    air_temp: 20,
    track_temp: 25,
    humidity: 50,
    ...commonSessionFields,
  });

  await SessionsRepository.upsert({
    id: RACE_SESSION_ID,
    type: DB_SESSION_TYPES.RACE,
    air_temp: 22,
    track_temp: 28,
    humidity: 45,
    ...commonSessionFields,
  });

  const winner = await DriversRepository.upsert({
    racing_number: 1,
    name: 'test winner',
    team_name: 'Test Team',
    team_color: 'ff0000',
    headshot_url: '',
  });

  const runnerUp = await DriversRepository.upsert({
    racing_number: 2,
    name: 'test runner up',
    team_name: 'Test Team',
    team_color: '0000ff',
    headshot_url: '',
  });

  await QualifyingResultsRepository.upsert({
    session_id: QUALIFYING_SESSION_ID,
    driver_id: winner.id,
    position: 1,
    q1_time: '1:30.000',
    q2_time: '1:29.000',
    q3_time: '1:28.000',
    knocked_out: false,
  });

  await QualifyingResultsRepository.upsert({
    session_id: QUALIFYING_SESSION_ID,
    driver_id: runnerUp.id,
    position: 2,
    q1_time: '1:30.500',
    q2_time: '1:29.500',
    q3_time: '1:28.500',
    knocked_out: false,
  });

  await RaceResultsRepository.upsert({
    session_id: RACE_SESSION_ID,
    driver_id: winner.id,
    position: 1,
    best_laptime: '1:32.000',
    gap_to_leader: null,
    gap_to_position_ahead: null,
    dnf: false,
    number_of_pit_stops: 1,
  });

  await RaceResultsRepository.upsert({
    session_id: RACE_SESSION_ID,
    driver_id: runnerUp.id,
    position: 2,
    best_laptime: '1:32.500',
    gap_to_leader: '+0.500',
    gap_to_position_ahead: '+0.500',
    dnf: false,
    number_of_pit_stops: 1,
  });
}

seed()
  .then(() => db.destroy())
  .catch(async (err) => {
    console.error(err);
    await db.destroy();
    process.exit(1);
  });
