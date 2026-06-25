import db from '../db.ts';
import type { Season } from './api_types/season.ts';
import fetch from './fetch.ts';
import DriversService from './service/drivers.service.ts';
import GrandPrixService from './service/grand_prixs.service.ts';
import QualifyingService from './service/qualifying.service.ts';
import RaceService from './service/race.service.ts';
import SessionNotFound from './session_not_found.error.ts';
import type { GrandPrix } from './types.ts';

const year = process.argv[2];
if (!year || !/^\d{4}$/.test(year)) {
  console.error('Usage: index.ts <year>  e.g. index.ts 2025');
  process.exit(1);
}

const season = await fetch<Season>(`${year}/Index.json`);

for (const meeting of season.Meetings) {
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
    await RaceService.storeRace({
      gpId: gp.id,
      racePath: gp.sprintPath,
      racingNumberToDriverId,
      isSprint: true,
    });
  }

  let racingNumberToDriverId = await DriversService.storeDrivers(
    gp.qualifyingPath,
  );
  await QualifyingService.storeQualifying({
    gpId: gp.id,
    qualifyingPath: gp.qualifyingPath,
    racingNumberToDriverId,
    isSprint: false,
  });

  racingNumberToDriverId = await DriversService.storeDrivers(gp.racePath);
  await RaceService.storeRace({
    gpId: gp.id,
    racePath: gp.racePath,
    racingNumberToDriverId,
    isSprint: false,
  });

  console.log(`Done! Inserted data for: ${gp.name}`);
}

await db.destroy();
