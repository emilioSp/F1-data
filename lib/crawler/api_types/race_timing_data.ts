import type { BestLapTime } from './best_lap_time.ts';
import type { Sector } from './sector.ts';
import type { Speeds } from './speeds.ts';
import type { TimingValue } from './timing_value.ts';

type IntervalToPositionAhead = {
  Value: string;
  Catching: boolean;
};

type RaceLine = {
  GapToLeader: string;
  IntervalToPositionAhead: IntervalToPositionAhead;
  Line: number;
  Position: string;
  ShowPosition: boolean;
  RacingNumber: string;
  Retired: boolean;
  InPit: boolean;
  PitOut: boolean;
  Stopped: boolean;
  Status: number;
  NumberOfLaps?: number;
  NumberOfPitStops?: number;
  Sectors: Sector[];
  Speeds: Speeds;
  BestLapTime: BestLapTime;
  LastLapTime: TimingValue;
};

export type RaceTimingData = {
  Lines: Record<string, RaceLine>;
  Withheld: boolean;
};
