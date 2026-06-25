export type DriverRaceInfo = {
  RacingNumber: string;
  Position: string;
  Gap: string;
  Interval: string;
  PitStops: number;
  Catching: number;
  OvertakeState: number;
  IsOut: boolean;
};

export type DriverRaceInfoList = Record<string, DriverRaceInfo>;
