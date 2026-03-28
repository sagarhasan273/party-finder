import packageJson from "../package.json";

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  googleAccessToken: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "PartyFinder",
  appVersion: packageJson.version,
  serverUrl: import.meta.env.SERVER_URL ?? "",
  googleAccessToken: import.meta.env.GOOGLE_ACCESS_TOKEN ?? "",
};
