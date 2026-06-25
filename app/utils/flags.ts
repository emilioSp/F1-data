const FLAGS: Record<string, string> = {
  KSA: '🇸🇦',
  NED: '🇳🇱',
  AUS: '🇦🇺',
  BEL: '🇧🇪',
  UAE: '🇦🇪',
  FRA: '🇫🇷',
  BRN: '🇧🇭',
  ITA: '🇮🇹',
  CHN: '🇨🇳',
  AZE: '🇦🇿',
  POR: '🇵🇹',
  GER: '🇩🇪',
  USA: '🇺🇸',
  JPN: '🇯🇵',
  HUN: '🇭🇺',
  AUT: '🇦🇹',
  MON: '🇲🇨',
  CAN: '🇨🇦',
  BRA: '🇧🇷',
  RUS: '🇷🇺',
  MEX: '🇲🇽',
  QAT: '🇶🇦',
  TUR: '🇹🇷',
  GBR: '🇬🇧',
  ESP: '🇪🇸',
  SGP: '🇸🇬',
};

export function getFlag(countryCode: string): string {
  return FLAGS[countryCode] ?? countryCode;
}
