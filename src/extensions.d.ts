declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPEN_WEATHER_API_KEY: string;
      OPEN_WEATHER_API_URL: string;
      PORT: string;
    }
  }
}
export {};
