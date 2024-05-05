import {
  validateAge,
  validateDate,
  validateWeather,
} from "../src/promocode/validators/validator.helper";
import { OpenWeatherResponseDTO } from "../src/services/weather/weather.interface";

describe("Validators helpers", () => {
  test("Age is equal to the requirements", () => {
    const ageRange = { eq: 18 };
    expect(validateAge(18, ageRange)).toBe(true);
    expect(validateAge(20, ageRange)).toBe(false);
  });
  test("Age is in the range requirements", () => {
    const ageRange = { gt: 18, lt: 40 };
    expect(validateAge(20, ageRange)).toBe(true);
    expect(validateAge(50, ageRange)).toBe(false);
  });

  test("Date is in the range requirements", () => {
    const dateRange = { after: "2024-01-01", before: "2024-06-30" };
    expect(validateDate("2024-03-01", dateRange)).toBe(true);
    expect(validateDate("2020-01-01", dateRange)).toBe(false);
    expect(validateDate("wrongFormat", dateRange)).toBe(false);
  });
  test("Weather is equal to the requirements", () => {
    const mockOpenWeatherResult = {
      weather: [{ main: "cloud" }],
      main: { temp: 12 },
    } as OpenWeatherResponseDTO;
    const weatherRange = { is: "cloud", temp: { eq: 12 } };
    expect(validateWeather(weatherRange, mockOpenWeatherResult)).toBe(true);
  });
  test("Weather temp is in the range requirements", () => {
    const mockOpenWeatherResult = {
      weather: [{ main: "cloud" }],
      main: { temp: 22 },
    } as OpenWeatherResponseDTO;
    const weatherRange = { is: "cloud", temp: { gt: 12 } };
    expect(validateWeather(weatherRange, mockOpenWeatherResult)).toBe(true);
  });
});
