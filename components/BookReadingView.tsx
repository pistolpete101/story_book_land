'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  Settings,
  BookOpen,
  Star,
  Heart,
  Share2
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
  readingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
  progress: number;
  rating: number;
  lastRead: string;
  pages: number;
}

interface BookReadingViewProps {
  book: Book;
  onBack: () => void;
}

export default function BookReadingView({ book, onBack }: BookReadingViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');

  // Use the actual book data passed to the component
  const pages = (book as any).chapters || book.pages || [];

  const currentPageData = pages[currentPage - 1];

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const progressPercentage = pages.length > 0 ? (currentPage / pages.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">by {book.author || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Chapter {currentPage} of {pages.length}</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-sm border-b border-gray-200"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <div className="flex space-x-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          fontSize === size
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex space-x-2">
                    {['light', 'sepia', 'dark'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          theme === themeOption
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card p-8 md:p-12"
        >
          <div className={`text-${fontSize === 'small' ? 'base' : fontSize === 'large' ? 'xl' : 'lg'} leading-relaxed`}>
            {currentPageData && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Chapter {currentPageData.chapterNumber}: {currentPageData.title}
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentPageData.content}
                  </div>
                </div>
                
                {currentPageData.settings && (currentPageData.settings.location || currentPageData.settings.timeOfDay || currentPageData.settings.weather) && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
                    {currentPageData.settings.location && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        📍 {currentPageData.settings.location}
                      </span>
                    )}
                    {currentPageData.settings.timeOfDay && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">
                        ⏰ {currentPageData.settings.timeOfDay}
                      </span>
                    )}
                    {currentPageData.settings.weather && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                        🌤️ {currentPageData.settings.weather}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-secondary'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Star className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === pages.length}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentPage === pages.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <span>{currentPage === pages.length ? 'Finished!' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {pages.map((_: unknown, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index + 1 === currentPage ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
