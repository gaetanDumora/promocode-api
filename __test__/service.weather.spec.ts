import {
  getOpenWeatherUrl,
  getOpenWeatherData,
} from "../src/services/weather/weather.service";

const mockFetch = jest.fn();
beforeAll(() => {
  global.fetch = mockFetch;
});

jest.mock("../src/config/config.app.ts", () => ({
  __esModule: true,
  default: {
    OPEN_WEATHER_API_URL: "https://mock",
    OPEN_WEATHER_API_KEY: "******",
  },
}));

describe("Services", () => {
  test("Weather service getOpenWeatherUrl", () => {
    const q = "CITY";
    const expectedUrl = "https://mock/?q=CITY&appid=******&units=metric";
    const { href } = getOpenWeatherUrl(q);
    expect(href).toBe(expectedUrl);
  });
  test("Weather service getOpenWeatherData", async () => {
    mockFetch.mockImplementation(() => ({ status: 404 }));
    await expect(getOpenWeatherData("cityName")).rejects.toThrow();
  });
});
