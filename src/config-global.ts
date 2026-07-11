import packageJson from "../package.json";

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  assetsDir: string;
  serverUrl: string;
  googleAccessToken: string;
  googleAuthClientId: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "PartyFinder",
  appVersion: packageJson.version,
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? "",
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "",
  googleAccessToken: import.meta.env.VITE_GOOGLE_ACCESS_TOKEN ?? "",
  googleAuthClientId: import.meta.env.VITE_GOOGLE_AUTH0_CLIENT_ID ?? "",
};
