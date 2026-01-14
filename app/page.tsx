'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingView from '@/components/OnboardingView';
import DashboardView from '@/components/DashboardView';
import { User } from '@/types/User';
import { getUserStories } from '@/lib/storage';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    try {
      const userId = 'test-user-123'; // Consistent user ID
      
      // Check for stories FIRST - this is the most reliable indicator
      // Wrap in try-catch to handle any storage errors
      let existingStories: any[] = [];
      try {
        existingStories = getUserStories(userId);
      } catch (storageError) {
        console.error('Error loading stories:', storageError);
        existingStories = [];
      }
      const hasStories = existingStories && existingStories.length > 0;
      console.log('Home: Checking for stories', { userId, hasStories, count: existingStories?.length });
      
      // Try to load saved user data first
      let savedUserData: string | null = null;
      try {
        savedUserData = localStorage.getItem(`user_${userId}`);
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }
      let testUser: User;
      
      if (savedUserData) {
      try {
        const parsed = JSON.parse(savedUserData);
        testUser = {
          id: userId,
          name: parsed.name || 'Test User',
          email: parsed.email || 'test@storybookland.com',
          age: parsed.age || 8,
          preferences: {
            favoriteGenres: parsed.preferences?.favoriteGenres || ['adventure', 'fantasy'],
            readingLevel: parsed.preferences?.readingLevel || 'intermediate',
            theme: parsed.preferences?.theme || 'light',
          },
          achievements: parsed.achievements || [],
          createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
          lastActiveAt: new Date(),
        };
      } catch (e) {
        console.error('Home: Error parsing saved user data', e);
        // If parsing fails, use defaults
        testUser = {
          id: userId,
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
      }
      } else {
        // No saved user data, create default
        testUser = {
        id: userId,
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
      }
      
      let onboardingComplete: string | null = null;
      try {
        onboardingComplete = localStorage.getItem(`onboarding_${userId}`);
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }
      
      // Skip onboarding if it's already complete OR if user has stories
      if (onboardingComplete || hasStories) {
        // If user has stories but no onboarding data, try to load user info from localStorage
        if (hasStories && !onboardingComplete) {
          let savedAge: string | null = null;
          let savedGenres: string | null = null;
          let savedReadingLevel: string | null = null;
          let savedName: string | null = null;
          try {
            savedAge = localStorage.getItem(`age_${userId}`);
            savedGenres = localStorage.getItem(`genres_${userId}`);
            savedReadingLevel = localStorage.getItem(`readingLevel_${userId}`);
            savedName = localStorage.getItem(`name_${userId}`);
          } catch (e) {
            console.error('Error accessing localStorage:', e);
          }
          
          if (savedName) {
            testUser.name = savedName;
          }
          if (savedAge) {
            testUser.age = parseInt(savedAge, 10);
          }
          if (savedGenres) {
            try {
              testUser.preferences.favoriteGenres = JSON.parse(savedGenres);
            } catch (e) {
              // Keep default genres
            }
          }
          if (savedReadingLevel) {
            const validLevels = ['beginner', 'intermediate', 'advanced'] as const;
            if (validLevels.includes(savedReadingLevel as any)) {
              testUser.preferences.readingLevel = savedReadingLevel as 'beginner' | 'intermediate' | 'advanced';
            }
          }
        }
        setUser(testUser);
      } else {
        setShowOnboarding(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Home: Error initializing user', error);
      // Set a default user on error
      try {
        setUser({
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
        });
      } catch (setError) {
        console.error('Home: Error setting default user', setError);
        setHasError(true);
      }
      setIsLoading(false);
    }
  }, []);

  const handleOnboardingComplete = (userData: User) => {
    const userId = userData.id || 'test-user-123'; // Ensure consistent ID
    const userToSave = {
      ...userData,
      id: userId, // Ensure ID is set
    };
    
    // Save user data to localStorage for persistence
    localStorage.setItem(`user_${userId}`, JSON.stringify({
      id: userId,
      name: userToSave.name,
      email: userToSave.email,
      age: userToSave.age,
      preferences: userToSave.preferences,
      achievements: userToSave.achievements || [],
      createdAt: userToSave.createdAt,
    }));
    
    // Save onboarding completion
    localStorage.setItem(`onboarding_${userId}`, 'true');
    localStorage.setItem(`age_${userId}`, userToSave.age.toString());
    localStorage.setItem(`name_${userId}`, userToSave.name);
    localStorage.setItem(`genres_${userId}`, JSON.stringify(userToSave.preferences.favoriteGenres));
    localStorage.setItem(`readingLevel_${userId}`, userToSave.preferences.readingLevel);
    
    setUser(userToSave);
    setShowOnboarding(false);
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the page. Please refresh your browser.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
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

  return (
    <div className="min-h-screen pt-0 px-2 sm:px-4 tablet:px-6 tablet-lg:px-8 pb-2 tablet:pb-4 safe-area-inset">
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OnboardingView onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : user ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardView user={user} />
          </motion.div>
        ) : (
          // Fallback loading state if user is null but not loading
          <motion.div
            key="loading-fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
