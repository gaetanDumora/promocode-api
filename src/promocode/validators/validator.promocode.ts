import {
  findErrors,
  validateAge,
  validateDate,
  validateWeather,
} from "./validator.helper";
import {
  CandidateValues,
  DateRange,
  WeatherRange,
} from "./validator.interface";
import { getOpenWeatherData } from "../../services/weather/weather.service";

export function* traverseJSON(
  json: Record<string, any>,
  context = ""
): Generator<{ key: string; value: Record<string, any>; context: string }> {
  for (const key in json) {
    const value = json[key];
    if (value instanceof Array) {
      context = key;
      for (const item of value) {
        yield* traverseJSON(item, context);
      }
    } else {
      yield { key, value, context };
    }
  }
}

export const evaluateRestriction = async (
  candidate: CandidateValues,
  restriction: Record<string, any>
) => {
  let parsedRestrictions = [];
  for (const { key, value, context } of traverseJSON(restriction)) {
    let isValid;
    if (key === "date" && candidate?.date) {
      isValid = validateDate(candidate.date, value as DateRange);
    }
    if (key === "age" && candidate?.age) {
      isValid = validateAge(candidate.age, value);
    }
    if (key === "weather" && candidate?.town) {
      const weatherAtCity = await getOpenWeatherData(candidate.town);
      isValid = validateWeather(value as WeatherRange, weatherAtCity);
    }
    parsedRestrictions.push({ context, [key]: value, isValid });
  }
  return parsedRestrictions;
};

export const validatePromocode = async (
  candidate: CandidateValues,
  restrictions: Record<string, unknown>[]
) => {
  const parsedRestrictions = [];
  for (const restriction of restrictions) {
    parsedRestrictions.push(
      ...(await evaluateRestriction(candidate, restriction))
    );
  }

  const accumulator = {
    errors: [],
    ors: [],
    ands: [],
  };
  const results = parsedRestrictions.reduce(
    findErrors,
    accumulator
  ) as typeof accumulator;

  return results;
};
