// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface User {
  name: string;
  tag: string;
  avatarInitials: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  const [user, setUser] = useState<User>({
    name: 'ProPlayer',
    tag: '#NA1',
    avatarInitials: 'PR',
  });

  const memoValue = useMemo(() => ({user, setUser: (payload: User | null) => {if (payload) setUser(payload)}}), [user, setUser])

  return (
    <AuthContext.Provider value={memoValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};