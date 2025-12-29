'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

  // In test mode, render children without SessionProvider
  if (testMode) {
    return <>{children}</>;
  }

  // Otherwise, wrap with NextAuth SessionProvider
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}

