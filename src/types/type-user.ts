export interface LocationWithRegion {
  country: string;
  countryCode: string;
  region: string;
  regionLabel: string;
}

export interface UserType {
  id?: string;
  name?: string;
  email?: string;
  profilePhoto?: string;
  gamename?: string;
  tagline?: string;
  region?: LocationWithRegion;
  [key: string]: unknown;
}
