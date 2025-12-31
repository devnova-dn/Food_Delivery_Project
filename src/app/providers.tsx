'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type AuthContextType = {
  signin: boolean;
  search: string | null;
};

const AuthContext = createContext<AuthContextType>({ signin: false, search: null });

export function Providers({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const signin = searchParams.get('signin') === 'true';
  const search = searchParams.get('search');

  return <AuthContext.Provider value={{ signin , search}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
