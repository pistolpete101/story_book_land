import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  
  if (TEST_MODE) {
    return null; // No session in test mode
  }
  
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

