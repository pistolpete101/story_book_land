'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { 
  BookOpen, 
  PenTool, 
  Trophy, 
  Settings, 
  Users, 
  Library,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';
import { getUserStories, saveUserStory } from '@/lib/storage';
import MyLibraryView from './MyLibraryView';
import StoryBuilderView from './StoryBuilderView';
import AchievementsView from './AchievementsView';
import SettingsView from './SettingsView';

interface DashboardViewProps {
  user: User;
}

export default function DashboardView({ user }: DashboardViewProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'library' | 'story-builder' | 'achievements' | 'settings'>('dashboard');
  const [publishedStories, setPublishedStories] = useState<any[]>([]);

  // Load user's stories on mount and when user changes
  useEffect(() => {
    if (!user || !user.id) {
      console.log('DashboardView: No user or user.id', { user, userId: user?.id });
      return;
    }
    
    const loadStories = () => {
      try {
        // For now, use localStorage
        // When database is set up, switch to: const stories = await getUserStoriesDB(user.id);
        const stories = getUserStories(user.id);
        console.log('DashboardView: Loaded stories', { userId: user.id, count: stories?.length, stories });
        setPublishedStories(stories || []);
      } catch (error) {
        console.error('DashboardView: Error loading stories', error);
        setPublishedStories([]);
      }
    };
    
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(loadStories, 100);
    return () => clearTimeout(timer);
  }, [user?.id]);

  const stats = [
    {
      title: 'Stories Created',
      value: publishedStories.length.toString(),
      icon: PenTool,
      color: 'from-primary-500 to-primary-600',
      change: publishedStories.length > 0 ? 'Great work!' : 'Start creating!',
    },
    {
      title: 'Books Read',
      value: publishedStories.filter(s => s.progress === 100).length.toString(),
      icon: BookOpen,
      color: 'from-secondary-500 to-secondary-600',
      change: publishedStories.length > 0 ? 'Keep reading!' : 'No books yet',
    },
    {
      title: 'Achievements',
      value: '0',
      icon: Trophy,
      color: 'from-accent-500 to-accent-600',
      change: 'Start earning!',
    },
    {
      title: 'Reading Streak',
      value: '0 days',
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      change: 'Begin your journey!',
    },
  ];

  const quickActions = [
    {
      title: 'My Library',
      description: 'Read your books and manage your collection',
      icon: Library,
      color: 'from-blue-500 to-blue-600',
      action: () => setCurrentView('library'),
    },
    {
      title: 'Create Story',
      description: 'Start building your next amazing story',
      icon: PenTool,
      color: 'from-green-500 to-green-600',
      action: () => setCurrentView('story-builder'),
    },
    {
      title: 'Achievements',
      description: 'View your progress and unlocked rewards',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      action: () => setCurrentView('achievements'),
    },
    {
      title: 'Settings',
      description: 'Customize your experience',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      action: () => setCurrentView('settings'),
    },
  ];

  const handleStoryPublished = (publishedStory: any) => {
    // Save story with user ID and author info
    // Ensure author is always a string for display
    const authorName = typeof publishedStory.author === 'object' 
      ? publishedStory.author?.name || user.name
      : publishedStory.author || user.name;
    
    const storyWithAuthor = {
      ...publishedStory,
      author: authorName, // Always store as string
      authorInfo: { // Keep object for reference if needed
        id: user.id,
        name: user.name,
      },
      createdAt: publishedStory.createdAt || new Date(),
      updatedAt: new Date(),
      publishedAt: publishedStory.status === 'published' ? (publishedStory.publishedAt || new Date()) : undefined,
      isPublished: publishedStory.status === 'published' || publishedStory.isPublished === true,
    };
    
    // Save to user-specific storage
    saveUserStory(user.id, storyWithAuthor);
    
    // Reload stories from storage to ensure we have the latest
    const allStories = getUserStories(user.id);
    setPublishedStories(allStories || []);
    
    // Navigate to library to show the published story
    setCurrentView('library');
  };

  const recentStories = publishedStories;

        const handleEditStory = (story: any) => {
          // Load the story into the builder
          setCurrentView('story-builder');
          // Store the story to edit
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('editStory', { detail: { story } }));
          }, 100);
        };

        if (currentView !== 'dashboard') {
          switch (currentView) {
            case 'library':
              return <MyLibraryView user={user} onBack={() => setCurrentView('dashboard')} publishedStories={publishedStories} onEditStory={handleEditStory} />;
            case 'story-builder':
              return <StoryBuilderView user={user} onBack={() => setCurrentView('dashboard')} onStoryPublished={handleStoryPublished} />;
            case 'achievements':
              return <AchievementsView user={user} onBack={() => setCurrentView('dashboard')} />;
            case 'settings':
              return <SettingsView user={user} onBack={() => setCurrentView('dashboard')} />;
            default:
              return null;
          }
        }

  return (
    <div className="pt-0 px-4 tablet:px-6 tablet-lg:px-8 pb-2 tablet:pb-4 safe-area-inset">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 tablet:mb-3 mt-0 flex-shrink-0"
        >
          <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
            <div>
              <h1 className="text-xl tablet:text-2xl font-bold text-gradient">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xs tablet:text-sm text-gray-600 mt-0.5">
                Ready to create some amazing stories today?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Reading Streak</div>
                <div className="text-xl tablet:text-2xl font-bold text-primary-600">
                  {publishedStories.length > 0 ? '1 day 🔥' : '0 days'}
                </div>
              </div>
              <div className="w-10 h-10 tablet:w-12 tablet:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-lg tablet:text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 tablet:grid-cols-2 tablet-lg:grid-cols-4 gap-2 tablet:gap-2 mb-1 tablet:mb-2 flex-shrink-0"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="card p-3 tablet:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 tablet:w-10 tablet:h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 tablet:w-5 tablet:h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl tablet:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs tablet:text-sm text-gray-500">{stat.title}</div>
                </div>
              </div>
              <div className="text-xs tablet:text-sm text-green-600 font-medium">{stat.change}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 tablet-lg:grid-cols-3 gap-3 tablet:gap-4">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="tablet-lg:col-span-1 flex flex-col"
          >
            <h2 className="text-base tablet:text-lg font-bold text-gray-900 mb-2 tablet:mb-3">Quick Actions</h2>
            <div className="space-y-2 tablet:space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="w-full p-3 tablet:p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 active:border-primary-400 transition-all duration-200 text-left group touch-manipulation"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 tablet:w-12 tablet:h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <action.icon className="w-5 h-5 tablet:w-6 tablet:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm tablet:text-base text-gray-900">{action.title}</div>
                      <div className="text-xs tablet:text-sm text-gray-600 line-clamp-1">{action.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Stories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="tablet-lg:col-span-2 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2 tablet:mb-3">
              <h2 className="text-base tablet:text-lg font-bold text-gray-900">Recent Stories</h2>
              {recentStories.length > 0 && (
                <button
                  onClick={() => setCurrentView('library')}
                  className="text-primary-600 hover:text-primary-700 active:text-primary-800 font-medium text-base tablet:text-lg min-h-[44px] px-3 touch-manipulation"
                >
                  View All
                </button>
              )}
            </div>
            {recentStories.length > 0 ? (
              <div className="grid grid-cols-1 tablet:grid-cols-2 tablet-lg:grid-cols-2 desktop:grid-cols-3 gap-2 tablet:gap-3">
                {recentStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    whileHover={{ scale: 1.05 }}
                    className="card overflow-hidden cursor-pointer border-2 border-amber-200 hover:border-amber-400 transition-colors bg-gradient-to-br from-amber-50 to-orange-50 shadow-md"
                    onClick={() => {
                      setCurrentView('library');
                      // Use a small delay to ensure library view is mounted
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('openBook', { detail: { bookId: story.id } }));
                      }, 200);
                    }}
                  >
                    <div className="relative">
                      <img
                        src={story.coverImage || '/placeholder-book.png'}
                        alt={story.title}
                        className="w-full h-32 tablet:h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                        {story.genre}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${story.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600">{story.progress}% complete</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 tablet:p-3">
                      <h3 className="font-semibold text-sm tablet:text-base text-gray-900 mb-0.5 line-clamp-1">{story.title}</h3>
                      <p className="text-xs tablet:text-sm text-gray-600">by {typeof story.author === 'object' ? story.author?.name || 'Unknown' : story.author || 'Unknown'}</p>
                      <p className="text-xs tablet:text-sm text-gray-500 mt-1">Last read {story.lastRead}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 tablet:py-6 flex flex-col items-center justify-center">
                <div className="text-4xl tablet:text-5xl mb-2">📚</div>
                <h3 className="text-base tablet:text-lg font-semibold text-gray-900 mb-1">No stories yet</h3>
                <p className="text-sm tablet:text-base text-gray-600 mb-3">
                  Start creating your first amazing story!
                </p>
                <button
                  onClick={() => setCurrentView('story-builder')}
                  className="btn-primary min-h-[44px] tablet:min-h-[48px] text-sm tablet:text-base px-4 tablet:px-6 touch-manipulation"
                >
                  Create Your First Story
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
