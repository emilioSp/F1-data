export type ChampionshipPredictionDriver = {
  RacingNumber: string;
  CurrentPosition: number;
  PredictedPosition: number;
  CurrentPoints: number;
  PredictedPoints: number;
};

export type ChampionshipPrediction = {
  Drivers: Record<string, ChampionshipPredictionDriver>;
};
