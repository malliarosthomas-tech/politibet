export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
  participationOdds: number;
  pollEstimate: number;
  politicalSpectrum: number;
}

export interface UserPrediction {
  participates: boolean;
  score: number;
}

export type Predictions = Record<string, UserPrediction>;

export interface PredictionSummary {
  id: string;
  userId: string;
  date: string;
  predictions: Predictions;
  candidates: Candidate[];
  boldnessScore: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}
