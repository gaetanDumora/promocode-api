export interface AgeRange {
  eq?: number;
  gt?: number;
  lt?: number;
}
export interface DateRange {
  after: string;
  before: string;
}
export interface WeatherRange {
  is: string;
  temp: { eq?: number; gt?: number; lt?: number };
}

export interface CandidateValues {
  date?: string;
  age?: number;
  town?: string;
}
