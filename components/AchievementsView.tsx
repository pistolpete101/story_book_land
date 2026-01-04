'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowLeft, Trophy, Star, BookOpen, PenTool, Heart, Zap, Target } from 'lucide-react';

interface AchievementsViewProps {
  user: User;
  onBack: () => void;
}

export default function AchievementsView({ user, onBack }: AchievementsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const achievements = [
    {
      id: 'first-story',
      title: 'First Story',
      description: 'Created your very first story',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      category: 'writing',
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      progress: 100,
    },
    {
      id: 'story-master',
      title: 'Story Master',
      description: 'Created 10 amazing stories',
      icon: PenTool,
      color: 'from-green-500 to-green-600',
      category: 'writing',
      unlocked: false,
      progress: 60,
      requirement: 'Create 10 stories',
      current: 6,
      total: 10,
    },
    {
      id: 'reading-champion',
      title: 'Reading Champion',
      description: 'Read 25 books',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      category: 'reading',
      unlocked: true,
      unlockedAt: new Date('2024-01-20'),
      progress: 100,
    },
    {
      id: 'speed-reader',
      title: 'Speed Reader',
      description: 'Read 5 books in one day',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      category: 'reading',
      unlocked: false,
      progress: 40,
      requirement: 'Read 5 books in one day',
      current: 2,
      total: 5,
    },
    {
      id: 'character-creator',
      title: 'Character Creator',
      description: 'Created 20 unique characters',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      category: 'creativity',
      unlocked: false,
      progress: 75,
      requirement: 'Create 20 characters',
      current: 15,
      total: 20,
    },
    {
      id: 'genre-explorer',
      title: 'Genre Explorer',
      description: 'Tried all story genres',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      category: 'creativity',
      unlocked: false,
      progress: 50,
      requirement: 'Try all 8 genres',
      current: 4,
      total: 8,
    },
    {
      id: 'weekly-writer',
      title: 'Weekly Writer',
      description: 'Wrote stories for 7 consecutive days',
      icon: Star,
      color: 'from-indigo-500 to-indigo-600',
      category: 'writing',
      unlocked: true,
      unlockedAt: new Date('2024-01-25'),
      progress: 100,
    },
    {
      id: 'book-lover',
      title: 'Book Lover',
      description: 'Read 50 books total',
      icon: Trophy,
      color: 'from-red-500 to-red-600',
      category: 'reading',
      unlocked: false,
      progress: 20,
      requirement: 'Read 50 books',
      current: 10,
      total: 50,
    },
  ];

  const categories = [
    { id: 'all', name: 'All', count: achievements.length },
    { id: 'writing', name: 'Writing', count: achievements.filter(a => a.category === 'writing').length },
    { id: 'reading', name: 'Reading', count: achievements.filter(a => a.category === 'reading').length },
    { id: 'creativity', name: 'Creativity', count: achievements.filter(a => a.category === 'creativity').length },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="h-screen pt-4 sm:pt-6 tablet:pt-8 px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-4 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={onBack}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">Achievements</h1>
                <p className="text-sm sm:text-base md:text-xl text-gray-600">Your progress and unlocked rewards</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-500">Progress</div>
              <div className="text-xl sm:text-2xl font-bold text-primary-600">
                {unlockedCount}/{totalCount}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 sm:h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-600">
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 sm:space-x-2 mb-2 sm:mb-4 flex-shrink-0"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 flex-1 overflow-hidden"
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`card p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col ${
                achievement.unlocked ? 'ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3 md:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center flex-shrink-0 ${
                  achievement.unlocked ? 'animate-pulse' : 'opacity-50'
                }`}>
                  <achievement.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0">🏆</div>
                )}
              </div>

              {achievement.unlocked ? (
                <div className="space-y-1 sm:space-y-2 mt-auto">
                  <div className="text-xs sm:text-sm text-green-600 font-medium line-clamp-1">
                    ✓ Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-green-500 h-1.5 sm:h-2 rounded-full w-full"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2 mt-auto">
                  <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                    {achievement.requirement}
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span>{achievement.current}/{achievement.total}</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <motion.div
                      className="bg-primary-500 h-1.5 sm:h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
