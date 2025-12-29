'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types/User';
import { BookOpen, Sparkles, Users, Star } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (user: User) => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: 8,
    favoriteGenres: [] as string[],
  });

  const features = [
    {
      icon: BookOpen,
      title: 'Create Amazing Stories',
      description: 'Build your own magical worlds with our easy-to-use story builder',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Sparkles,
      title: 'Unleash Creativity',
      description: 'Design characters, choose settings, and bring your imagination to life',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: Users,
      title: 'Share & Read',
      description: 'Share your stories with friends and discover amazing tales from others',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Star,
      title: 'Earn Achievements',
      description: 'Unlock badges and rewards as you create and read more stories',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const genres = [
    { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♀️' },
    { id: 'mystery', name: 'Mystery', emoji: '🔍' },
    { id: 'science-fiction', name: 'Science Fiction', emoji: '🚀' },
    { id: 'fairy-tale', name: 'Fairy Tale', emoji: '👸' },
    { id: 'animal', name: 'Animal Stories', emoji: '🐰' },
    { id: 'friendship', name: 'Friendship', emoji: '🤝' },
    { id: 'magic', name: 'Magic', emoji: '✨' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: `${userData.name.toLowerCase().replace(' ', '.')}@storybookland.com`,
        age: userData.age,
        preferences: {
          favoriteGenres: userData.favoriteGenres,
          readingLevel: userData.age < 6 ? 'beginner' : userData.age < 10 ? 'intermediate' : 'advanced',
          theme: 'light',
        },
        achievements: [],
        createdAt: new Date(),
        lastActiveAt: new Date(),
      };
      onComplete(newUser);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleGenre = (genreId: string) => {
    setUserData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genreId)
        ? prev.favoriteGenres.filter(id => id !== genreId)
        : [...prev.favoriteGenres, genreId]
    }));
  };

  const steps = [
    {
      title: 'Welcome to Story Book Land!',
      subtitle: 'Where your imagination comes to life',
      content: (
        <div className="space-y-3 tablet:space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="text-4xl tablet:text-5xl mb-2">📚</div>
            <h1 className="text-2xl tablet:text-3xl font-bold text-gradient mb-2">
              Welcome to Story Book Land!
            </h1>
            <p className="text-sm tablet:text-base text-gray-600 max-w-2xl mx-auto mb-3 tablet:mb-4">
              A magical place where you can create, read, and share amazing stories. 
              Let's get started on your adventure!
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 tablet:gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card p-3 tablet:p-4 text-center"
              >
                <div className={`w-12 h-12 tablet:w-14 tablet:h-14 mx-auto mb-2 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 tablet:w-7 tablet:h-7 text-white" />
                </div>
                <h3 className="text-base tablet:text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs tablet:text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "What's your name?",
      subtitle: 'We need to know what to call you!',
      content: (
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">👋</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">
              What's your name?
            </h2>
            <p className="text-xl text-gray-600">
              We need to know what to call you in your stories!
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-6 py-4 text-xl text-center border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
        </div>
      ),
    },
    {
      title: 'How old are you?',
      subtitle: 'This helps us recommend the perfect stories for you',
      content: (
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">🎂</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">
              How old are you?
            </h2>
            <p className="text-xl text-gray-600">
              This helps us recommend the perfect stories for you!
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary-600 mb-2">
                {userData.age}
              </div>
              <input
                type="range"
                min="4"
                max="12"
                value={userData.age}
                onChange={(e) => setUserData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full h-3 bg-primary-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>4</span>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'What stories do you love?',
      subtitle: 'Choose your favorite types of stories',
      content: (
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">❤️</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">
              What stories do you love?
            </h2>
            <p className="text-xl text-gray-600">
              Choose your favorite types of stories (you can pick as many as you want!)
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {genres.map((genre) => (
              <motion.button
                key={genre.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(genre.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  userData.favoriteGenres.includes(genre.id)
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-2">{genre.emoji}</div>
                <div className="font-semibold text-sm">{genre.name}</div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen flex items-center justify-center p-2 tablet:p-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-4 tablet:p-6 max-h-full overflow-y-auto"
          >
            {steps[step].content}
            
            <div className="flex justify-between items-center mt-4 tablet:mt-6 flex-shrink-0">
              <button
                onClick={handlePrevious}
                disabled={step === 0}
                className={`px-4 tablet:px-6 py-2 tablet:py-3 rounded-xl font-semibold text-sm tablet:text-base transition-all ${
                  step === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary-600 hover:bg-primary-50'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1.5 tablet:space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 tablet:w-3 tablet:h-3 rounded-full transition-all ${
                      index === step ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                disabled={step === 1 && !userData.name.trim()}
                className={`px-4 tablet:px-8 py-2 tablet:py-3 rounded-xl font-semibold text-sm tablet:text-base transition-all ${
                  step === 1 && !userData.name.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {step === 3 ? 'Start Your Adventure!' : 'Next'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
