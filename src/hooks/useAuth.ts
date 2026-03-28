import { useCredentials } from "src/core/slices";

import { loginDemo } from "../store/authSlice";
import { useAppSelector, useAppDispatch } from "../store";

export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const { logout } = useCredentials();

  return {
    user,
    isLoading,
    isAuthenticated,
    login: () => dispatch(loginDemo()),
    signOut: logout(),
  };
}
