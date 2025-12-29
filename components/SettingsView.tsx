'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/User';
import { ArrowLeft, User as UserIcon, Bell, Palette, Shield, HelpCircle, LogOut, Save } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onBack: () => void;
}

export default function SettingsView({ user, onBack }: SettingsViewProps) {
  const { signOut } = useAuth();
  const [settings, setSettings] = useState({
    profile: {
      name: user.name,
      email: user.email,
      age: user.age,
      avatar: user.avatar || '',
    },
    preferences: {
      theme: user.preferences.theme,
      readingLevel: user.preferences.readingLevel,
      favoriteGenres: user.preferences.favoriteGenres,
    },
    notifications: {
      storyUpdates: true,
      newBooks: true,
      achievements: true,
      weeklyReport: false,
    },
    privacy: {
      profilePublic: true,
      showReadingProgress: true,
      allowMessages: true,
    },
  });

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  const themes = [
    { id: 'light', name: 'Light', description: 'Clean and bright' },
    { id: 'dark', name: 'Dark', description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', description: 'Follows system setting' },
  ];

  const readingLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Simple words and short sentences' },
    { id: 'intermediate', name: 'Intermediate', description: 'More complex stories' },
    { id: 'advanced', name: 'Advanced', description: 'Challenging content' },
  ];

  const genres = [
    'Adventure', 'Fantasy', 'Mystery', 'Science Fiction', 'Fairy Tale',
    'Animal Stories', 'Friendship', 'Magic', 'Romance', 'Horror'
  ];

  const handleSave = () => {
    // In a real app, this would save to the backend
    // Settings saved successfully
    // Show success message
  };

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/sign-in' });
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, name: e.target.value }
          }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, email: e.target.value }
          }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age
        </label>
        <input
          type="number"
          value={settings.profile.age}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, age: parseInt(e.target.value) }
          }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          min="4"
          max="18"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL
        </label>
        <input
          type="url"
          value={settings.profile.avatar}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, avatar: e.target.value }
          }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Theme
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, theme: theme.id as any }
              }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.preferences.theme === theme.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {theme.name}
                </div>
                <div className="text-sm text-gray-600">{theme.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Reading Level
        </label>
        <div className="space-y-3">
          {readingLevels.map((level) => (
            <label key={level.id} className="flex items-center space-x-3">
              <input
                type="radio"
                name="readingLevel"
                value={level.id}
                checked={settings.preferences.readingLevel === level.id}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, readingLevel: e.target.value as any }
                }))}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{level.name}</div>
                <div className="text-sm text-gray-600">{level.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Favorite Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                const currentGenres = settings.preferences.favoriteGenres;
                const newGenres = currentGenres.includes(genre)
                  ? currentGenres.filter(g => g !== genre)
                  : [...currentGenres, genre];
                setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, favoriteGenres: newGenres }
                }));
              }}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                settings.preferences.favoriteGenres.includes(genre)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="text-sm text-gray-600">
                {key === 'storyUpdates' && 'Get notified when your stories are liked or commented on'}
                {key === 'newBooks' && 'Be the first to know about new books in your favorite genres'}
                {key === 'achievements' && 'Celebrate when you unlock new achievements'}
                {key === 'weeklyReport' && 'Receive a weekly summary of your reading activity'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: e.target.checked }
              }))}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.privacy).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="text-sm text-gray-600">
                {key === 'profilePublic' && 'Allow others to see your profile and stories'}
                {key === 'showReadingProgress' && 'Show your reading progress to friends'}
                {key === 'allowMessages' && 'Allow other users to send you messages'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, [key]: e.target.checked }
              }))}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">How do I create a story?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Click on "Create Story" from your dashboard and follow the step-by-step process to build your amazing story.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Can I edit my stories after publishing?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Yes! You can always edit your stories from your library. Changes will be saved as a new version.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">How do I share my stories?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Once published, you can share your stories using the share button. You can also make them public for others to discover.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
        <p className="text-sm text-gray-600 mb-4">
          Need help? We're here for you! Reach out to our support team.
        </p>
        <button className="btn-primary text-sm">
          Contact Support
        </button>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'help':
        return renderHelpTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gradient">Settings</h1>
                <p className="text-xl text-gray-600">Customize your Story Book Land experience</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-primary text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              {renderActiveTab()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
