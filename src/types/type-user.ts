import type { z as zod } from "zod";
import type { Region } from "src/@mock";
import type { Dispatch, SetStateAction } from "react";
import type { UserSchema } from "src/schemas/user-schema";

// ----------------------------------------------------------------------
export type UserType = zod.infer<typeof UserSchema>;

// ----------------------------------------------------------------------

export type UserContextTypes = {
  user: UserType | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export type LocationWithRegion = {
  country: string;
  countryCode: string;
  region: Region["code"];
  regionLabel: Region["label"];
};
