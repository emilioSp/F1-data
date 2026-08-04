import DriversRepository from '../../lib/crawler/repository/drivers.repository.ts';
import DriversStandingsRepository from '../../lib/crawler/repository/drivers_standings.repository.ts';
import GrandsPrixRepository from '../../lib/crawler/repository/grands_prix.repository.ts';
import QualifyingResultsRepository from '../../lib/crawler/repository/qualifying_results.repository.ts';
import RaceResultsRepository from '../../lib/crawler/repository/race_results.repository.ts';
import SessionsRepository from '../../lib/crawler/repository/sessions.repository.ts';
import TeamsStandingsRepository from '../../lib/crawler/repository/teams_standings.repository.ts';
import { DB_SESSION_TYPES } from '../../lib/crawler/types.ts';
import db from '../../lib/db.ts';

import {
  FUTURE_GP_ID,
  FUTURE_QUALIFYING_SESSION_ID,
  GP_ID,
  QUALIFYING_SESSION_ID,
  RACE_POINTS,
  RACE_SESSION_ID,
  SPRINT_POINTS,
  SPRINT_QUALIFYING_SESSION_ID,
  SPRINT_SESSION_ID,
} from './constants.ts';

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
    sprint_qualifying_path: '/test/sprint-qualifying/',
    sprint_path: '/test/sprint/',
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

  await SessionsRepository.upsert({
    id: SPRINT_QUALIFYING_SESSION_ID,
    type: DB_SESSION_TYPES.SPRINT_QUALIFYING,
    air_temp: 19,
    track_temp: 24,
    humidity: 52,
    ...commonSessionFields,
  });

  await SessionsRepository.upsert({
    id: SPRINT_SESSION_ID,
    type: DB_SESSION_TYPES.SPRINT,
    air_temp: 21,
    track_temp: 27,
    humidity: 48,
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

  // ── Sprint qualifying results (winner takes pole) ──
  await QualifyingResultsRepository.upsert({
    session_id: SPRINT_QUALIFYING_SESSION_ID,
    driver_id: winner.id,
    position: 1,
    q1_time: '1:29.500',
    q2_time: '1:28.500',
    q3_time: '1:27.500',
    knocked_out: false,
  });

  await QualifyingResultsRepository.upsert({
    session_id: SPRINT_QUALIFYING_SESSION_ID,
    driver_id: runnerUp.id,
    position: 2,
    q1_time: '1:30.000',
    q2_time: '1:29.000',
    q3_time: '1:28.000',
    knocked_out: false,
  });

  // ── Sprint results (runner-up wins the sprint) ──
  await RaceResultsRepository.upsert({
    session_id: SPRINT_SESSION_ID,
    driver_id: runnerUp.id,
    position: 1,
    best_laptime: '1:31.000',
    gap_to_leader: null,
    gap_to_position_ahead: null,
    dnf: false,
    number_of_pit_stops: 0,
  });

  await RaceResultsRepository.upsert({
    session_id: SPRINT_SESSION_ID,
    driver_id: winner.id,
    position: 2,
    best_laptime: '1:31.500',
    gap_to_leader: '+0.500',
    gap_to_position_ahead: '+0.500',
    dnf: false,
    number_of_pit_stops: 0,
  });

  // ── Standings ──
  // Sprint: runner-up P1 → 8 pts, winner P2 → 7 pts.
  // Race:   winner P1 → 25 pts, runner-up P2 → 18 pts.
  // Standings are stored per session as a championship snapshot as of that
  // session. The race snapshot is cumulative (sprint + race points).
  // Qualifying awards no points → no standings rows for qualifying sessions.
  const sprintWinnerPts = SPRINT_POINTS[0]; // 8 — runner-up won the sprint
  const sprintRunnerUpPts = SPRINT_POINTS[1]; // 7
  const raceWinnerPts = RACE_POINTS[0]; // 25
  const raceRunnerUpPts = RACE_POINTS[1]; // 18

  // Sprint-session snapshot (championship as of the sprint)
  await DriversStandingsRepository.upsert({
    session_id: SPRINT_SESSION_ID,
    driver_id: runnerUp.id,
    points: sprintWinnerPts,
  });
  await DriversStandingsRepository.upsert({
    session_id: SPRINT_SESSION_ID,
    driver_id: winner.id,
    points: sprintRunnerUpPts,
  });
  await TeamsStandingsRepository.upsert({
    session_id: SPRINT_SESSION_ID,
    team_name: 'Test Team',
    points: sprintWinnerPts + sprintRunnerUpPts,
  });

  // Race-session snapshot (cumulative: sprint + race)
  await DriversStandingsRepository.upsert({
    session_id: RACE_SESSION_ID,
    driver_id: winner.id,
    points: sprintRunnerUpPts + raceWinnerPts,
  });
  await DriversStandingsRepository.upsert({
    session_id: RACE_SESSION_ID,
    driver_id: runnerUp.id,
    points: sprintWinnerPts + raceRunnerUpPts,
  });
  await TeamsStandingsRepository.upsert({
    session_id: RACE_SESSION_ID,
    team_name: 'Test Team',
    points:
      sprintWinnerPts + sprintRunnerUpPts + raceWinnerPts + raceRunnerUpPts,
  });

  // ─── GP 2: Future Grand Prix (qualifying only — race not started yet) ──
  await GrandsPrixRepository.upsert({
    id: FUTURE_GP_ID,
    number: 2,
    year: 1900,
    official_name: 'Future Grand Prix',
    name: 'Future GP',
    circuit_name: 'Future Circuit',
    country_code: 'YY',
    location: 'Future City',
    qualifying_path: '/future/qualifying/',
  });

  await SessionsRepository.upsert({
    id: FUTURE_QUALIFYING_SESSION_ID,
    type: DB_SESSION_TYPES.QUALIFYING,
    air_temp: 18,
    track_temp: 22,
    humidity: 60,
    gp_id: FUTURE_GP_ID,
    start_date: now,
    end_date: now,
    start_date_local: now,
    end_date_local: now,
    gmt_offset: '+00:00',
  });

  const poleSitter = await DriversRepository.upsert({
    racing_number: 3,
    name: 'test pole sitter',
    team_name: 'Future Team',
    team_color: '00ff00',
    headshot_url: '',
  });

  const challenger = await DriversRepository.upsert({
    racing_number: 4,
    name: 'test challenger',
    team_name: 'Future Team',
    team_color: 'ffa500',
    headshot_url: '',
  });

  await QualifyingResultsRepository.upsert({
    session_id: FUTURE_QUALIFYING_SESSION_ID,
    driver_id: poleSitter.id,
    position: 1,
    q1_time: '1:31.000',
    q2_time: '1:30.000',
    q3_time: '1:29.500',
    knocked_out: false,
  });

  await QualifyingResultsRepository.upsert({
    session_id: FUTURE_QUALIFYING_SESSION_ID,
    driver_id: challenger.id,
    position: 2,
    q1_time: '1:31.500',
    q2_time: '1:30.500',
    q3_time: '1:30.000',
    knocked_out: false,
  });
}

seed()
  .then(() => db.destroy())
  .catch(async (err) => {
    console.error(err);
    await db.destroy();
    process.exit(1);
  });
