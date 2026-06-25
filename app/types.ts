export type GpSummary = {
  name: string;
  circuitName: string;
  countryCode: string;
  winnerName: string;
  winnerTeamName: string;
  winnerTeamColor: string;
  poleName: string;
  poleTeamName: string;
  poleTeamColor: string;
  id: number;
  location: string;
  number: number;
  officialName: string;
  raceDate: string;
  type: 'sprint_qualifiyng' | 'qualifying' | 'sprint' | 'race';
  raceAirTemp: string;
  raceTrackTemp: string;
  raceHumidity: string;
  year: number;
};

export type GPDetailsQualifyingResults = {
  position: number;
  driverName: string;
  racingNumber: number;
  teamName: string;
  teamColor: string;
  q1Time: string;
  q2Time: string;
  q3Time: string;
  knockedOut: boolean;
};

export type GPDetailsRaceResults = {
  position: number;
  driverName: string;
  racingNumber: number;
  teamName: string;
  teamColor: string;
  bestLaptime: string;
  gapToLeader: string;
  gapToPositionAhead: string;
  dnf: boolean;
  numberOfPitStops: number;
};

export type GPSessionDetails = {
  name: string;
  number: number;
  location: string;
  officialName: string;
  circuitName: string;
  countryCode: string;
  year: number;
  startDate: string;
  airTemp: string;
  trackTemp: string;
  humidity: string;
};
