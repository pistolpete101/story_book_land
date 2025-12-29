'use client';

import { useSession, signOut } from 'next-auth/react';

const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export function useAuth() {
  // In test mode, return mock data
  if (TEST_MODE) {
    return {
      data: null,
      status: 'unauthenticated' as const,
      isSignedIn: false,
      user: null,
      signOut: async () => {},
    };
  }

  const { data: session, status } = useSession();

  return {
    data: session,
    status,
    isSignedIn: status === 'authenticated',
    user: session?.user || null,
    signOut: async () => {
      await signOut({ callbackUrl: '/sign-in' });
    },
  };
}

