import type { BestLapTime } from './best_lap_time.ts';
import type { Sector } from './sector.ts';
import type { Speeds } from './speeds.ts';
import type { TimingValue } from './timing_value.ts';

type LapTimeEntry = {
  Value?: string;
  Lap?: number;
};

type Stat = {
  TimeDiffToFastest: string;
  TimeDifftoPositionAhead: string;
};

type QualifyingLine = {
  KnockedOut: boolean;
  Cutoff: boolean;
  BestLapTimes: LapTimeEntry[];
  Stats: Stat[];
  Line: number;
  Position: string;
  ShowPosition: boolean;
  RacingNumber: string;
  Retired: boolean;
  InPit: boolean;
  PitOut: boolean;
  Stopped: boolean;
  Status: number;
  NumberOfLaps: number;
  NumberOfPitStops: number;
  Sectors: Sector[];
  Speeds: Speeds;
  BestLapTime: BestLapTime;
  LastLapTime: TimingValue;
};

export type QualifyingTimingData = {
  NoEntries: number[];
  SessionPart: number;
  CutOffTime: string;
  CutOffPercentage: string;
  Lines: Record<string, QualifyingLine>;
  Withheld: boolean;
};
