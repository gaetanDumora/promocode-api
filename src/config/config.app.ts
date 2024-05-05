import dotenv from "dotenv";

dotenv.config();

interface ENV {
  OPEN_WEATHER_API_KEY: string | undefined;
  OPEN_WEATHER_API_URL: string | undefined;
  PORT: string | undefined;
}

interface Config {
  OPEN_WEATHER_API_KEY: string;
  OPEN_WEATHER_API_URL: string;
  PORT: string;
}

const getConfig = (): ENV => {
  return {
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
    OPEN_WEATHER_API_URL: process.env.OPEN_WEATHER_API_URL,
    PORT: process.env.PORT,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
