import type { Circuit } from './circuit.ts';
import type { Country } from './country.ts';

export type { Circuit, Country };

export const SESSION_TYPES = {
  PRACTISE: 'Practice',
  QUALIFYING: 'Qualifying',
  RACE: 'Race',
} as const;

export const NAME_TYPES = {
  PRACTISE_1: 'Practice 1',
  PRACTISE_2: 'Practice 2',
  PRACTISE_3: 'Practice 3',
  SPRINT_QUALIFYING: 'Sprint Qualifying',
  SPRINT_SHOOTOUT: 'Sprint Shootout',
  SPRINT: 'Sprint',
  QUALIFYING: 'Qualifying',
  RACE: 'Race',
} as const;

export type Session = {
  Key: number;
  Type: (typeof SESSION_TYPES)[keyof typeof SESSION_TYPES];
  Number: number;
  Name: (typeof NAME_TYPES)[keyof typeof NAME_TYPES];
  StartDate: string;
  EndDate: string;
  GmtOffset: string;
  Path: string;
};

export type Meeting = {
  Key: number;
  Code: string;
  Number: number;
  Location: string;
  OfficialName: string;
  Name: string;
  Country: Country;
  Circuit: Circuit;
  Sessions: Session[];
};

export type Season = {
  Year: number;
  Meetings: Meeting[];
};
