'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type AuthContextType = {
  signin: boolean;
};

const AuthContext = createContext<AuthContextType>({ signin: false });

export function Providers({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const signin = searchParams.get('signin') === 'true';

  return <AuthContext.Provider value={{ signin }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
