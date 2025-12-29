'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Plus, Trash2, Edit3, Image, Type, Palette } from 'lucide-react';

interface StoryWritingViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface StoryChapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  layout: 'text-only' | 'image-text' | 'text-image' | 'full-image';
  characters: string[];
  settings: {
    location?: string;
    timeOfDay?: string;
    weather?: string;
  };
}

export default function StoryWritingView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  isFirstStep,
  isLastStep,
}: StoryWritingViewProps) {
  const [chapters, setChapters] = useState<StoryChapter[]>(storyData.chapters || []);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<StoryChapter | null>(null);
  const [newChapter, setNewChapter] = useState<Partial<StoryChapter>>({
    title: '',
    content: '',
    layout: 'text-only',
    characters: [],
    settings: {
      location: '',
      timeOfDay: '',
      weather: '',
    },
  });

  const layoutOptions = [
    { id: 'text-only', name: 'Text Only', icon: Type, description: 'Just words' },
    { id: 'image-text', name: 'Image + Text', icon: Image, description: 'Image above text' },
    { id: 'text-image', name: 'Text + Image', icon: Image, description: 'Text above image' },
    { id: 'full-image', name: 'Full Image', icon: Palette, description: 'Image with text overlay' },
  ];

  const timeOfDayOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Dawn', 'Dusk'];
  const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy', 'Stormy'];

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.content) {
      const chapter: StoryChapter = {
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber: chapters.length + 1,
        title: newChapter.title,
        content: newChapter.content,
        layout: newChapter.layout || 'text-only',
        characters: newChapter.characters || [],
        settings: newChapter.settings || {
          location: '',
          timeOfDay: '',
          weather: '',
        },
      };
      setChapters([...chapters, chapter]);
      setNewChapter({
        title: '',
        content: '',
        layout: 'text-only',
        characters: [],
        settings: {
          location: '',
          timeOfDay: '',
          weather: '',
        },
      });
      setShowChapterForm(false);
    }
  };

  const handleEditChapter = (chapter: StoryChapter) => {
    setEditingChapter(chapter);
    setNewChapter(chapter);
    setShowChapterForm(true);
  };

  const handleUpdateChapter = () => {
    if (editingChapter && newChapter.title && newChapter.content) {
      setChapters(chapters.map(c => 
        c.id === editingChapter.id 
          ? { ...c, ...newChapter } as StoryChapter
          : c
      ));
      setEditingChapter(null);
      setNewChapter({
        title: '',
        content: '',
        layout: 'text-only',
        characters: [],
        settings: {
          location: '',
          timeOfDay: '',
          weather: '',
        },
      });
      setShowChapterForm(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updatedChapters = chapters.filter(c => c.id !== chapterId).map((c, index) => ({
      ...c,
      chapterNumber: index + 1,
    }));
    setChapters(updatedChapters);
  };

  const handleMoveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const chapterIndex = chapters.findIndex(c => c.id === chapterId);
    if (
      (direction === 'up' && chapterIndex > 0) ||
      (direction === 'down' && chapterIndex < chapters.length - 1)
    ) {
      const newChapters = [...chapters];
      const targetIndex = direction === 'up' ? chapterIndex - 1 : chapterIndex + 1;
      [newChapters[chapterIndex], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[chapterIndex]];
      
      // Update chapter numbers
      const updatedChapters = newChapters.map((c, index) => ({
        ...c,
        chapterNumber: index + 1,
      }));
      setChapters(updatedChapters);
    }
  };

  const handleNext = () => {
    onComplete({ chapters });
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">✍️</div>
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Write Your Story
        </h2>
        <p className="text-xl text-gray-600">
          Create the chapters that will bring your story to life
        </p>
      </motion.div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 h-80 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-lg">
                {chapter.chapterNumber}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleMoveChapter(chapter.id, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveChapter(chapter.id, 'down')}
                  disabled={index === chapters.length - 1}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleEditChapter(chapter)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{chapter.title}</h3>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {layoutOptions.find(l => l.id === chapter.layout)?.name}
              </span>
              {chapter.settings.location && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  📍 {chapter.settings.location}
                </span>
              )}
              {chapter.settings.timeOfDay && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                  🕐 {chapter.settings.timeOfDay}
                </span>
              )}
              {chapter.settings.weather && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  🌤️ {chapter.settings.weather}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-600 text-sm line-clamp-6 leading-relaxed mb-2">{chapter.content}</p>
              <div className="text-xs text-gray-400">
                {chapter.content.split(' ').filter(word => word.length > 0).length} words • {chapter.content.length} characters
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Chapter Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowChapterForm(true)}
          className="h-80 card p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors flex flex-col items-center justify-center"
        >
          <Plus className="w-8 h-8 text-gray-400 mb-3" />
          <span className="text-lg font-semibold text-gray-600">Add New Chapter</span>
        </motion.button>
      </div>

      {/* Chapter Form Modal */}
      {showChapterForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
            </h3>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={newChapter.title || ''}
                    onChange={(e) => setNewChapter(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter chapter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout
                  </label>
                  <select
                    value={newChapter.layout || 'text-only'}
                    onChange={(e) => setNewChapter(prev => ({ ...prev, layout: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {layoutOptions.map((layout) => (
                      <option key={layout.id} value={layout.id}>
                        {layout.name} - {layout.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Content
                </label>
                <textarea
                  value={newChapter.content || ''}
                  onChange={(e) => setNewChapter(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={6}
                  placeholder="Write your story content here..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {newChapter.content?.split(' ').filter(word => word.length > 0).length || 0} words • {newChapter.content?.length || 0} characters
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newChapter.settings?.location || ''}
                    onChange={(e) => setNewChapter(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, location: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Magic Forest"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Day
                  </label>
                  <select
                    value={newChapter.settings?.timeOfDay || ''}
                    onChange={(e) => setNewChapter(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, timeOfDay: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeOfDayOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weather
                  </label>
                  <select
                    value={newChapter.settings?.weather || ''}
                    onChange={(e) => setNewChapter(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, weather: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select weather</option>
                    {weatherOptions.map((weather) => (
                      <option key={weather} value={weather}>{weather}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowChapterForm(false);
                  setEditingChapter(null);
                  setNewChapter({
                    title: '',
                    content: '',
                    layout: 'text-only',
                    characters: [],
                    settings: {
                      location: '',
                      timeOfDay: '',
                      weather: '',
                    },
                  });
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingChapter ? handleUpdateChapter : handleAddChapter}
                disabled={!newChapter.title || !newChapter.content}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !newChapter.title || !newChapter.content
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {editingChapter ? 'Update Chapter' : 'Add Chapter'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Chapters Created</div>
          <div className="text-lg font-bold text-primary-600">{chapters.length}</div>
        </div>

        <button
          onClick={handleNext}
          disabled={chapters.length === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            chapters.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
