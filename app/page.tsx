'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingView from '@/components/OnboardingView';
import DashboardView from '@/components/DashboardView';
import DeviceRecommendation from '@/components/DeviceRecommendation';
import { User } from '@/types/User';
import { getUserStories } from '@/lib/storage';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const userId = 'test-user-123'; // Consistent user ID
    
    // Check for stories FIRST - this is the most reliable indicator
    const existingStories = getUserStories(userId);
    const hasStories = existingStories && existingStories.length > 0;
    console.log('Home: Checking for stories', { userId, hasStories, count: existingStories?.length });
    
    // Try to load saved user data first
    const savedUserData = localStorage.getItem(`user_${userId}`);
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
    
    const onboardingComplete = localStorage.getItem(`onboarding_${userId}`);
    
    // Skip onboarding if it's already complete OR if user has stories
    if (onboardingComplete || hasStories) {
      // If user has stories but no onboarding data, try to load user info from localStorage
      if (hasStories && !onboardingComplete) {
        const savedAge = localStorage.getItem(`age_${userId}`);
        const savedGenres = localStorage.getItem(`genres_${userId}`);
        const savedReadingLevel = localStorage.getItem(`readingLevel_${userId}`);
        const savedName = localStorage.getItem(`name_${userId}`);
        
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
          testUser.preferences.readingLevel = savedReadingLevel;
        }
      }
      setUser(testUser);
    } else {
      setShowOnboarding(true);
    }
    setIsLoading(false);
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
    <div className="min-h-screen pt-0 px-4 tablet:px-6 tablet-lg:px-8 pb-2 tablet:pb-4 safe-area-inset">
      <DeviceRecommendation />
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
        ) : null}
      </AnimatePresence>
    </div>
  );
}
