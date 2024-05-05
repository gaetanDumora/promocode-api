import config from "../../config/config.app";
import { OpenWeatherResponseDTO } from "./weather.interface";

export const getOpenWeatherUrl = (q: string) => {
  try {
    const url = new URL(config.OPEN_WEATHER_API_URL);
    url.searchParams.append("q", q);
    url.searchParams.append("appid", config.OPEN_WEATHER_API_KEY);
    url.searchParams.append("units", "metric");
    return url;
  } catch (error) {
    throw new Error("OPEN_WEATHER_API_URL build has failed");
  }
};

export const getOpenWeatherData = async (
  cityName: string
): Promise<OpenWeatherResponseDTO> => {
  const url = getOpenWeatherUrl(cityName);
  const response = await fetch(url.href);
  if (response.status !== 200) {
    throw new Error(
      `Fetch data to ${url} failed with status: ${response.statusText}`
    );
  }
  const body: OpenWeatherResponseDTO = await response.json();
  return body;
};
