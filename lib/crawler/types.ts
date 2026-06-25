export type GrandPrix = {
  id: number;
  number: number;
  year: number;
  officialName: string;
  name: string;
  circuitName: string;
  countryCode: string;
  location: string;
  sprintQualifyingPath?: string;
  sprintPath?: string;
  qualifyingPath: string;
  racePath: string;
};

export type Driver = {
  id?: string;
  racing_number: number;
  name: string;
  team_name: string;
  team_color: string;
  headshot_url: string;
};

export type QualifyingResult = {
  id?: string;
  session_id: number;
  driver_id: string;
  position: number;
  q1_time: string | null;
  q2_time: string | null;
  q3_time: string | null;
  knocked_out: boolean;
};

export type RaceResult = {
  id?: string;
  session_id: number;
  driver_id: string;
  position: number;
  best_laptime: string | null;
  gap_to_leader: string | null;
  gap_to_position_ahead: string | null;
  dnf: boolean;
  number_of_pit_stops: number;
};

export const DB_SESSION_TYPES = {
  SPRINT_QUALIFYING: 'sprint_qualifying',
  SPRINT: 'sprint',
  QUALIFYING: 'qualifying',
  RACE: 'race',
} as const;

export type Session = {
  id: number;
  type: (typeof DB_SESSION_TYPES)[keyof typeof DB_SESSION_TYPES];
  gp_id: number;
  start_date: string;
  start_date_local: string;
  end_date: string;
  end_date_local: string;
  gmt_offset: string;
  air_temp: number;
  track_temp: number;
  humidity: number;
};
