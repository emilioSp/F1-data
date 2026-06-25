import type { Segment } from './segment.ts';

export type Sector = {
  Stopped: boolean;
  PreviousValue?: string;
  Segments: Segment[];
  Value: string;
  Status: number;
  OverallFastest: boolean;
  PersonalFastest: boolean;
};
