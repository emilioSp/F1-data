import {
  type Meeting,
  NAME_TYPES,
  SESSION_TYPES,
} from '../api_types/season.ts';
import GrandsPrixRepository from '../repository/grands_prix.repository.ts';
import SessionNotFound from '../session_not_found.error.ts';

type MeetingWithYear = Meeting & {
  year: number;
};

const GrandPrixService = {
  storeGrandPrix: async (gp: MeetingWithYear) => {
    const qualifying = gp.Sessions.find(
      (s) =>
        s.Type === SESSION_TYPES.QUALIFYING && s.Name === NAME_TYPES.QUALIFYING,
    );
    if (!qualifying?.Path) {
      throw new SessionNotFound(
        `Qualifying session not found for GP: ${gp.Name}, year: ${gp.year}`,
      );
    }

    const race = gp.Sessions.find(
      (s) => s.Type === SESSION_TYPES.RACE && s.Name === NAME_TYPES.RACE,
    );
    if (!race?.Path) {
      throw new SessionNotFound(
        `Race session not found for GP: ${gp.Name}, year: ${gp.year}`,
      );
    }

    const sprint_qualifying = gp.Sessions.find(
      (s) =>
        s.Type === SESSION_TYPES.QUALIFYING &&
        (s.Name === NAME_TYPES.SPRINT_QUALIFYING ||
          s.Name === NAME_TYPES.SPRINT_SHOOTOUT),
    );
    const sprint = gp.Sessions.find(
      (s) => s.Type === SESSION_TYPES.RACE && s.Name === NAME_TYPES.SPRINT,
    );

    return await GrandsPrixRepository.upsert({
      id: gp.Key,
      year: gp.year,
      number: gp.Number,
      official_name: gp.OfficialName,
      name: gp.Name,
      circuit_name: gp.Circuit.ShortName,
      country_code: gp.Country.Code,
      location: gp.Location,
      sprint_qualifying_path: sprint_qualifying?.Path,
      sprint_path: sprint?.Path,
      qualifying_path: qualifying.Path,
      race_path: race.Path,
    });
  },
};

export default GrandPrixService;
