'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingView from '@/components/OnboardingView';
import DashboardView from '@/components/DashboardView';
import DeviceRecommendation from '@/components/DeviceRecommendation';
import { User } from '@/types/User';
import { useAuth } from '@/hooks/useAuth';

// Test mode - set to true to bypass authentication for testing
const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true' || false;

export default function Home() {
  // Use NextAuth hooks
  const { isSignedIn, user: authUser, status } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [testMode] = useState(TEST_MODE);

  useEffect(() => {
    // Test mode: create a test user
    if (testMode) {
      const testUser: User = {
        id: 'test-user-123',
        name: 'Test User',
        email: 'test@storybookland.com',
        age: 8,
        preferences: {
          favoriteGenres: ['adventure', 'fantasy'],
          readingLevel: 'intermediate',
          theme: 'light',
        },
        achievements: [],
        createdAt: new Date(),
        lastActiveAt: new Date(),
      };
      
      const onboardingComplete = localStorage.getItem('onboarding_test-user-123');
      if (!onboardingComplete) {
        setShowOnboarding(true);
      } else {
        setUser(testUser);
      }
      setIsLoading(false);
      return;
    }

    // Normal mode: require authentication
    if (status === 'loading') return;

    if (!isSignedIn) {
      // Redirect to sign-in if not authenticated
      router.push('/sign-in');
      return;
    }

    if (isSignedIn && authUser) {
      // Check if user has completed onboarding
      const userId = authUser.id || authUser.email || 'user';
      const onboardingComplete = localStorage.getItem(`onboarding_${userId}`);
      
      if (!onboardingComplete) {
        setShowOnboarding(true);
        setIsLoading(false);
      } else {
        // Convert NextAuth user to our User type
        const appUser: User = {
          id: userId,
          name: authUser.name || 'User',
          email: authUser.email || '',
          age: parseInt(localStorage.getItem(`age_${userId}`) || '8'),
          preferences: {
            favoriteGenres: JSON.parse(localStorage.getItem(`genres_${userId}`) || '[]'),
            readingLevel: localStorage.getItem(`readingLevel_${userId}`) as 'beginner' | 'intermediate' | 'advanced' || 'intermediate',
            theme: 'light',
          },
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date(),
        };
        setUser(appUser);
        setIsLoading(false);
      }
    }
  }, [isSignedIn, status, authUser, router, testMode]);

  const handleOnboardingComplete = (userData: User) => {
    const userId = testMode ? userData.id : (authUser?.id || authUser?.email || userData.id);
    if (userId) {
      localStorage.setItem(`onboarding_${userId}`, 'true');
      localStorage.setItem(`age_${userId}`, userData.age.toString());
      localStorage.setItem(`genres_${userId}`, JSON.stringify(userData.preferences.favoriteGenres));
      localStorage.setItem(`readingLevel_${userId}`, userData.preferences.readingLevel);
    }
    setUser(userData);
    setShowOnboarding(false);
  };

  if ((!testMode && status === 'loading') || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  if (!testMode && !isSignedIn) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="h-screen pt-0 px-4 tablet:px-6 tablet-lg:px-8 pb-2 tablet:pb-4 safe-area-inset overflow-hidden flex flex-col">
      <DeviceRecommendation />
      <div className="flex-1 min-h-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {showOnboarding || !user ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OnboardingView onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardView user={user} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
