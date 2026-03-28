import { useAppSelector, useAppDispatch } from '../store';
import { loginDemo, logout } from '../store/authSlice';

export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  return {
    user,
    isLoading,
    isAuthenticated,
    login: () => dispatch(loginDemo()),
    signOut: () => dispatch(logout()),
  };
}
