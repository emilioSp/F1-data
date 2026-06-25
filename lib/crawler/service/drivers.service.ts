import type { DriverList } from '../api_types/driver_list.ts';
import fetch from '../fetch.ts';
import DriversRepository from '../repository/drivers.repository.ts';

const driverCache = new Map<string, string>(); // `${name}|${team_name}` → UUID

const DriversService = {
  storeDrivers: async (racePath: string): Promise<Map<string, string>> => {
    const driverList = await fetch<DriverList>(`${racePath}DriverList.json`);
    const racingNumberToId = new Map<string, string>();

    for (const driver of Object.values(driverList)) {
      const cacheKey = `${driver.FullName}|${driver.TeamName}`;
      let uuid = driverCache.get(cacheKey);

      if (!uuid) {
        console.log(
          `Inserting new driver: ${driver.FullName} ${driver.TeamName}`,
        );
        const row = await DriversRepository.upsert({
          racing_number: Number(driver.RacingNumber),
          name: driver.FullName,
          team_name: driver.TeamName,
          team_color: driver.TeamColour,
          headshot_url: driver.HeadshotUrl,
        });
        uuid = row.id;
        driverCache.set(cacheKey, uuid);
      }

      racingNumberToId.set(driver.RacingNumber, uuid);
    }

    return racingNumberToId;
  },
};

export default DriversService;
