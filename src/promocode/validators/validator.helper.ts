import { OpenWeatherResponseDTO } from "../../services/weather/weather.interface";
import { AgeRange, DateRange, WeatherRange } from "./validator.interface";

export const validateAge = (candidate: number, ageRange: AgeRange) => {
  if (ageRange?.gt && ageRange?.lt) {
    return candidate > ageRange.gt && candidate < ageRange.lt;
  }
  return candidate === ageRange?.eq ?? false;
};
export const validateDate = (candidate: string, dateRange: DateRange) => {
  const date = new Date(candidate);
  const maxDate = new Date(dateRange.before);
  const minDate = new Date(dateRange.after);
  if (date && maxDate && minDate) {
    return date <= maxDate && date >= minDate;
  }
  return false;
};

export const validateWeather = (
  candidate: WeatherRange,
  weatherDTO: OpenWeatherResponseDTO
) => {
  const { temp } = weatherDTO.main;
  const [{ main }] = weatherDTO.weather;

  if (candidate.is.toLocaleLowerCase() !== main.toLocaleLowerCase()) {
    return false;
  }
  if (candidate.temp?.eq) {
    return candidate.temp.eq === temp;
  }
  if (candidate.temp?.gt) {
    return temp > candidate.temp.gt;
  }
  if (candidate.temp?.lt) {
    return temp < candidate.temp.lt;
  }
  return false;
};

export const findErrors = (
  falsyValues: Record<string, any>,
  current: Record<string, any>
) => {
  // An OR that is KO is not necessarily a sign of error
  // Let's keep track of them
  if (
    !current.isValid &&
    (current.context === "or" || current.context === "")
  ) {
    falsyValues.ors.push(current);
  }
  // An AND is an error, if there are previous KO ORs, or not
  if (
    (!current.isValid && current.context === "and" && falsyValues.ors.length) ||
    (!current.isValid && current.context === "and")
  ) {
    falsyValues.errors.push(...falsyValues.ors, current);
    // Clear cached ORs as they are identified as errors
    falsyValues.ors = [];
    // Keep track of ANDs
    falsyValues.ands.push(current);
  }
  // We had never met KO ANDs conditions, KO ORs are real errors
  if (!falsyValues.ands.length && falsyValues.ors.length) {
    falsyValues.errors = [];
  }
  return falsyValues;
};
