// Season 1900 doesn't exist in AVAILABLE_SEASONS, so these IDs can never
// collide with real hydrated data.
export const GP_ID = 1900000001;
export const QUALIFYING_SESSION_ID = 1900000011;
export const RACE_SESSION_ID = 1900000012;
export const SPRINT_QUALIFYING_SESSION_ID = 1900000013;
export const SPRINT_SESSION_ID = 1900000014;

// A second GP whose race hasn't started yet — only qualifying exists.
export const FUTURE_GP_ID = 1900000002;
export const FUTURE_QUALIFYING_SESSION_ID = 1900000021;

// F1 points system (2022+): race 25-18-15-…, sprint 8-7-6-…
// Qualifying awards no championship points.
export const RACE_POINTS: readonly number[] = [
  25, 18, 15, 12, 10, 8, 6, 4, 2, 1,
];
export const SPRINT_POINTS: readonly number[] = [8, 7, 6, 5, 4, 3, 2, 1];
