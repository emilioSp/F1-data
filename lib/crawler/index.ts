import db from '../db.ts';
import { AVAILABLE_SEASONS } from '../years.ts';
import type { Season } from './api_types/season.ts';
import fetch from './fetch.ts';
import DriversService from './service/drivers.service.ts';
import DriversStandingsService from './service/drivers_standings.service.ts';
import GrandPrixService from './service/grands_prix.service.ts';
import QualifyingService from './service/qualifying.service.ts';
import RaceService from './service/race.service.ts';
import SessionNotFound from './session_not_found.error.ts';
import type { GrandPrix } from './types.ts';

const LAST_GP_TO_FETCH = 3;
const CHAMPIONSHIP_PREDICTION_MIN_YEAR = 2020; // Standings are not available before 2020

const detectMode = () => {
  const seasonArg: string = process.argv[2];

  if (!seasonArg || !/^\d{4}$/.test(seasonArg)) {
    return {
      cronMode: true,
      seasonYear: AVAILABLE_SEASONS.at(-1),
    };
  }

  return {
    seasonYear: seasonArg,
    cronMode: false,
  };
};

const { seasonYear, cronMode } = detectMode();

if (cronMode) {
  console.log(
    `Cron mode activated. Fetch last ${LAST_GP_TO_FETCH} GP, season ${seasonYear}`,
  );
}

const season = await fetch<Season>(`${seasonYear}/Index.json`);

const meetings = cronMode
  ? season.Meetings.slice(-LAST_GP_TO_FETCH)
  : season.Meetings;

for (const meeting of meetings) {
  let gp: GrandPrix;
  try {
    gp = await GrandPrixService.storeGrandPrix({
      ...meeting,
      year: season.Year,
    });
  } catch (e) {
    if (e instanceof SessionNotFound) {
      console.warn(`${e.message}. SKIPPED`);
      continue;
    }
    throw e;
  }

  if (gp.sprintQualifyingPath) {
    const driverMapRacingNumberToId = await DriversService.storeDrivers(
      gp.sprintQualifyingPath,
    );
    await QualifyingService.storeQualifying({
      gpId: gp.id,
      qualifyingPath: gp.sprintQualifyingPath,
      racingNumberToDriverId: driverMapRacingNumberToId,
      isSprint: true,
    });
  }

  if (gp.sprintPath) {
    const racingNumberToDriverId = await DriversService.storeDrivers(
      gp.sprintPath,
    );
    const [session] = await RaceService.storeRace({
      gpId: gp.id,
      racePath: gp.sprintPath,
      racingNumberToDriverId,
      isSprint: true,
    });
    if (season.Year >= CHAMPIONSHIP_PREDICTION_MIN_YEAR) {
      await DriversStandingsService.storeDriversStandings({
        session_id: session.id,
        racePath: gp.sprintPath,
        racingNumberToDriverId,
      });
    }
  }

  if (gp.qualifyingPath) {
    const racingNumberToDriverId = await DriversService.storeDrivers(
      gp.qualifyingPath,
    );
    await QualifyingService.storeQualifying({
      gpId: gp.id,
      qualifyingPath: gp.qualifyingPath,
      racingNumberToDriverId,
      isSprint: false,
    });
  }

  if (gp.racePath) {
    const racingNumberToDriverId = await DriversService.storeDrivers(
      gp.racePath,
    );
    const [session] = await RaceService.storeRace({
      gpId: gp.id,
      racePath: gp.racePath,
      racingNumberToDriverId,
      isSprint: false,
    });

    if (season.Year >= CHAMPIONSHIP_PREDICTION_MIN_YEAR) {
      await DriversStandingsService.storeDriversStandings({
        session_id: session.id,
        racePath: gp.racePath,
        racingNumberToDriverId,
      });
    }
  }

  console.log(`Done! Inserted data for: ${gp.name}`);
}

await db.destroy();
