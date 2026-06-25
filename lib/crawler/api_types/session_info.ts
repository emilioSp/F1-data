import type { Circuit } from './circuit.ts';
import type { Country } from './country.ts';

type SessionMeeting = {
  Key: number;
  Name: string;
  OfficialName: string;
  Location: string;
  Number: number;
  Country: Country;
  Circuit: Circuit;
};

type ArchiveStatus = {
  Status: string;
};

export type SessionInfo = {
  Meeting: SessionMeeting;
  ArchiveStatus: ArchiveStatus;
  Key: number;
  Type: string;
  Name: string;
  StartDate: string;
  EndDate: string;
  GmtOffset: string;
  Path: string;
};
