import type { z as zod } from "zod";
import type { Dispatch, SetStateAction } from "react";

import type { Region } from "../@mock";
import type { UserSchema } from "../schemas/user-schema";

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
