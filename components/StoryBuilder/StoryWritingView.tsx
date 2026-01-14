'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Plus, Trash2, Edit3, Image, X, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { checkGrammar, getWritingTips } from '@/lib/spellCheck';

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
  layout: 'image-text' | 'text-image';
  image?: string;
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
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1); // -1 means new chapter
  const [newChapter, setNewChapter] = useState<Partial<StoryChapter>>({
    title: '',
    content: '',
    layout: 'image-text',
    image: undefined,
    characters: [],
    settings: {
      location: '',
      timeOfDay: '',
      weather: '',
    },
  });
  const [showCharacterCards, setShowCharacterCards] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [grammarIssues, setGrammarIssues] = useState<{ issues: string[]; suggestions: string[] }>({ issues: [], suggestions: [] });
  const [showSpellCheck, setShowSpellCheck] = useState(true);

  // Get characters from storyData
  const characters = storyData.characters || [];
  
  // Check grammar when content changes
  useEffect(() => {
    if (newChapter.content) {
      const result = checkGrammar(newChapter.content);
      setGrammarIssues(result);
    } else {
      setGrammarIssues({ issues: [], suggestions: [] });
    }
  }, [newChapter.content]);

  const layoutOptions = [
    { id: 'image-text', name: 'Image + Text', icon: Image, description: 'Image above text' },
    { id: 'text-image', name: 'Text + Image', icon: Image, description: 'Text above image' },
  ];

  const timeOfDayOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Dawn', 'Dusk'];
  const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy', 'Stormy'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      // Enhanced file validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      // Check for empty file
      if (file.size === 0) {
        alert('File is empty');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setNewChapter(prev => ({ ...prev, image: imageDataUrl }));
      };
      reader.onerror = () => {
        alert('Failed to load image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewChapter(prev => ({ ...prev, image: undefined }));
  };

  const handleAddChapter = (stayOpen: boolean = false) => {
    if (newChapter.title && newChapter.content) {
      const chapter: StoryChapter = {
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber: chapters.length + 1,
        title: newChapter.title,
        content: newChapter.content,
        layout: newChapter.layout || 'image-text',
        image: newChapter.image,
        characters: newChapter.characters || [],
        settings: newChapter.settings || {
          location: '',
          timeOfDay: '',
          weather: '',
        },
      };
      setChapters([...chapters, chapter]);
      
      if (stayOpen) {
        // Move to next chapter (new one)
        setCurrentChapterIndex(-1);
        setNewChapter({
          title: '',
          content: '',
          layout: 'image-text',
          image: undefined,
          characters: [],
          settings: {
            location: '',
            timeOfDay: '',
            weather: '',
          },
        });
      } else {
        setNewChapter({
          title: '',
          content: '',
          layout: 'image-text',
          image: undefined,
          characters: [],
          settings: {
            location: '',
            timeOfDay: '',
            weather: '',
          },
        });
        setShowChapterForm(false);
        setCurrentChapterIndex(-1);
      }
    }
  };

  const handleEditChapter = (chapter: StoryChapter) => {
    const chapterIndex = chapters.findIndex(c => c.id === chapter.id);
    setEditingChapter(chapter);
    setCurrentChapterIndex(chapterIndex);
    setNewChapter(chapter);
    setShowChapterForm(true);
  };

  const handleNavigateToChapter = (direction: 'next' | 'prev') => {
    // Save current chapter first
    if (currentChapterIndex === -1) {
      // Currently creating a new chapter - save it first
      if (newChapter.title && newChapter.content) {
        const chapter: StoryChapter = {
          id: Math.random().toString(36).substr(2, 9),
          chapterNumber: chapters.length + 1,
          title: newChapter.title!,
          content: newChapter.content!,
          layout: newChapter.layout || 'image-text',
          image: newChapter.image,
          characters: newChapter.characters || [],
          settings: newChapter.settings || {
            location: '',
            timeOfDay: '',
            weather: '',
          },
        };
        const updatedChapters = [...chapters, chapter];
        setChapters(updatedChapters);
        
        // Navigate based on direction
        if (direction === 'next') {
          // Move to new chapter (stay at -1)
          setCurrentChapterIndex(-1);
          setEditingChapter(null);
          setNewChapter({
            title: '',
            content: '',
            layout: 'image-text',
            characters: [],
            settings: {
              location: '',
              timeOfDay: '',
              weather: '',
            },
          });
        }
        return;
      }
    } else {
      // Currently editing - save changes first
      if (newChapter.title && newChapter.content && editingChapter) {
        const updatedChapters = chapters.map(chap =>
          chap.id === editingChapter.id
            ? {
                ...chap,
                title: newChapter.title!,
                content: newChapter.content!,
                layout: newChapter.layout || 'image-text',
                image: newChapter.image,
                characters: newChapter.characters || [],
                settings: newChapter.settings || {
                  location: '',
                  timeOfDay: '',
                  weather: '',
                },
              }
            : chap
        );
        setChapters(updatedChapters);
        
        // Navigate based on direction
        if (direction === 'next') {
          if (currentChapterIndex < updatedChapters.length - 1) {
            const nextChapter = updatedChapters[currentChapterIndex + 1];
            setCurrentChapterIndex(currentChapterIndex + 1);
            setEditingChapter(nextChapter);
            setNewChapter(nextChapter);
          } else {
            // At last chapter, move to new chapter
            setCurrentChapterIndex(-1);
            setEditingChapter(null);
            setNewChapter({
              title: '',
              content: '',
              layout: 'image-text',
              characters: [],
              settings: {
                location: '',
                timeOfDay: '',
                weather: '',
              },
            });
          }
        } else {
          // Previous
          if (currentChapterIndex > 0) {
            const prevChapter = updatedChapters[currentChapterIndex - 1];
            setCurrentChapterIndex(currentChapterIndex - 1);
            setEditingChapter(prevChapter);
            setNewChapter(prevChapter);
          }
        }
      }
    }
  };

  const handleUpdateChapter = (stayOpen: boolean = false) => {
    if (editingChapter && newChapter.title && newChapter.content) {
      setChapters(chapters.map(chap =>
        chap.id === editingChapter.id
          ? {
              ...chap,
              title: newChapter.title!,
              content: newChapter.content!,
              layout: newChapter.layout || 'image-text',
              image: newChapter.image,
              characters: newChapter.characters || [],
              settings: newChapter.settings || {
                location: '',
                timeOfDay: '',
                weather: '',
              },
            }
          : chap
      ));
      
      if (!stayOpen) {
        setEditingChapter(null);
        setCurrentChapterIndex(-1);
        setNewChapter({
          title: '',
          content: '',
          layout: 'image-text',
          image: undefined,
          characters: [],
          settings: {
            location: '',
            timeOfDay: '',
            weather: '',
          },
        });
        setShowChapterForm(false);
      }
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
      {/* Character Cards Section */}
      {characters.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Your Characters</h3>
            <button
              onClick={() => setShowCharacterCards(!showCharacterCards)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showCharacterCards ? 'Hide' : 'Show'} Characters
            </button>
          </div>
          {showCharacterCards && (
            <div className="grid grid-cols-1 tablet:grid-cols-2 tablet-lg:grid-cols-3 desktop:grid-cols-4 gap-4 mb-6">
              {characters.map((character: any) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-4 border-2 border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    {character.image ? (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {character.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{character.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        character.role === 'protagonist' ? 'bg-green-100 text-green-700' :
                        character.role === 'antagonist' ? 'bg-red-100 text-red-700' :
                        character.role === 'supporting' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {character.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{character.description}</p>
                  {character.personality?.traits?.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">Traits:</div>
                      <div className="flex flex-wrap gap-1">
                        {character.personality.traits.slice(0, 3).map((trait: string, idx: number) => (
                          <span key={idx} className="text-xs px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded">
                            {trait}
                          </span>
                        ))}
                        {character.personality.traits.length > 3 && (
                          <span className="text-xs text-gray-500">+{character.personality.traits.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {character.appearance && (
                    <div className="text-xs text-gray-500 space-y-0.5">
                      {character.appearance.hairColor && (
                        <div>Hair: {character.appearance.hairColor}</div>
                      )}
                      {character.appearance.eyeColor && (
                        <div>Eyes: {character.appearance.eyeColor}</div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
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
            
            {chapter.image && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {layoutOptions.find(l => l.id === chapter.layout)?.name}
              </span>
              {chapter.image && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full flex items-center space-x-1">
                  <Image className="w-3 h-3" />
                  <span>Image</span>
                </span>
              )}
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
          onClick={() => {
            setCurrentChapterIndex(-1);
            setEditingChapter(null);
            setNewChapter({
              title: '',
              content: '',
              layout: 'image-text',
              image: undefined,
              characters: [],
              settings: {
                location: '',
                timeOfDay: '',
                weather: '',
              },
            });
            setShowChapterForm(true);
          }}
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
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[95vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingChapter ? `Edit Chapter ${editingChapter.chapterNumber}` : 'Create New Chapter'}
              </h3>
              <div className="flex items-center space-x-3">
                {editingChapter && (
                  <div className="text-sm text-gray-500">
                    Chapter {currentChapterIndex + 1} of {chapters.length}
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowChapterForm(false);
                    setEditingChapter(null);
                    setCurrentChapterIndex(-1);
                    setNewChapter({
                      title: '',
                      content: '',
                      layout: 'image-text',
                      characters: [],
                      settings: {
                        location: '',
                        timeOfDay: '',
                        weather: '',
                      },
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {/* Basic Info - Title and Layout */}
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
                    value={newChapter.layout || 'image-text'}
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Image (optional)
                </label>
                {newChapter.image ? (
                  <div className="relative">
                    <img
                      src={newChapter.image}
                      alt="Chapter preview"
                      className="w-full max-h-64 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="chapter-image-upload"
                    />
                    <label
                      htmlFor="chapter-image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </label>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Add an image to display with your chapter text.
                </p>
              </div>

              {/* Settings - Location, Time, Weather */}
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
                    placeholder="e.g., Forest, Castle, Beach"
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

              {/* Character Reference Cards in Form */}
              {characters.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Character Reference</h4>
                  <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {characters.map((character: any) => (
                      <div
                        key={character.id}
                        className="bg-white rounded-lg p-2 border border-gray-200 text-xs"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {character.image ? (
                            <img
                              src={character.image}
                              alt={character.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                              {character.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{character.name}</div>
                            <div className="text-gray-500 text-xs">{character.role}</div>
                          </div>
                        </div>
                        <div className="text-gray-600 line-clamp-2 mb-1">{character.description}</div>
                        {character.personality?.traits?.length > 0 && (
                          <div className="flex flex-wrap gap-0.5">
                            {character.personality.traits.slice(0, 2).map((trait: string, idx: number) => (
                              <span key={idx} className="text-xs px-1 py-0.5 bg-primary-100 text-primary-700 rounded">
                                {trait}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Chapter Content
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGuide(true)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Writing Guide
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSpellCheck(!showSpellCheck)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        showSpellCheck 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showSpellCheck ? '✓ Spell Check On' : 'Spell Check Off'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={newChapter.content || ''}
                  onChange={(e) => setNewChapter(prev => ({ ...prev, content: e.target.value }))}
                  spellCheck={showSpellCheck}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={6}
                  placeholder="Write your chapter content here..."
                />
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-gray-500">
                    {newChapter.content?.split(' ').filter(word => word.length > 0).length || 0} words • {newChapter.content?.length || 0} characters
                  </div>
                  {grammarIssues.issues.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{grammarIssues.issues.length} issue{grammarIssues.issues.length > 1 ? 's' : ''} found</span>
                    </div>
                  )}
                </div>
                {grammarIssues.issues.length > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-sm font-medium text-amber-800 mb-2">Writing Tips:</div>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {grammarIssues.suggestions.slice(0, 3).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Character Selection */}
              {characters.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Characters in this Chapter (optional)
                    </label>
                    {/* Form Actions - on same line as character label */}
                    <div className="flex items-center space-x-2">
                      {((editingChapter && currentChapterIndex > 0) || (!editingChapter && chapters.length > 0)) && (
                        <button
                          onClick={() => {
                            if (currentChapterIndex === -1 && chapters.length > 0) {
                              // Creating new chapter - go to last chapter
                              const lastChapter = chapters[chapters.length - 1];
                              setCurrentChapterIndex(chapters.length - 1);
                              setEditingChapter(lastChapter);
                              setNewChapter(lastChapter);
                            } else {
                              // Navigate to previous
                              handleNavigateToChapter('prev');
                            }
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 rotate-180" />
                          <span>Previous</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowChapterForm(false);
                          setEditingChapter(null);
                          setCurrentChapterIndex(-1);
                          setNewChapter({
                            title: '',
                            content: '',
                            layout: 'image-text',
                            characters: [],
                            settings: {
                              location: '',
                              timeOfDay: '',
                              weather: '',
                            },
                          });
                        }}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => editingChapter ? handleUpdateChapter() : handleAddChapter()}
                        disabled={!newChapter.title || !newChapter.content}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          !newChapter.title || !newChapter.content
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {editingChapter ? 'Update' : 'Add'}
                      </button>
                      <button
                        onClick={() => {
                          if (editingChapter) {
                            handleNavigateToChapter('next');
                          } else {
                            // Save current and create next
                            handleNavigateToChapter('next');
                          }
                        }}
                        disabled={!newChapter.title || !newChapter.content}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          !newChapter.title || !newChapter.content
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                        }`}
                      >
                        <span>{editingChapter && currentChapterIndex < chapters.length - 1 ? 'Next' : 'Add & New'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2">
                    {characters.map((character: any) => (
                      <label
                        key={character.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                          newChapter.characters?.includes(character.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newChapter.characters?.includes(character.id) || false}
                          onChange={(e) => {
                            const currentChars = newChapter.characters || [];
                            if (e.target.checked) {
                              setNewChapter(prev => ({
                                ...prev,
                                characters: [...currentChars, character.id]
                              }));
                            } else {
                              setNewChapter(prev => ({
                                ...prev,
                                characters: currentChars.filter((id: string) => id !== character.id)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {character.image ? (
                            <img
                              src={character.image}
                              alt={character.name}
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {character.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900 truncate">{character.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Form Actions - only show if no characters section */}
            {characters.length === 0 && (
              <div className="flex justify-between items-center mt-8">
                <div className="flex items-center space-x-2">
                  {((editingChapter && currentChapterIndex > 0) || (!editingChapter && chapters.length > 0)) && (
                    <button
                      onClick={() => {
                        if (currentChapterIndex === -1 && chapters.length > 0) {
                          // Creating new chapter - go to last chapter
                          const lastChapter = chapters[chapters.length - 1];
                          setCurrentChapterIndex(chapters.length - 1);
                          setEditingChapter(lastChapter);
                          setNewChapter(lastChapter);
                        } else {
                          // Navigate to previous
                          handleNavigateToChapter('prev');
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>Previous</span>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setShowChapterForm(false);
                      setEditingChapter(null);
                      setCurrentChapterIndex(-1);
                      setNewChapter({
                        title: '',
                        content: '',
                        layout: 'image-text',
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
                    onClick={() => editingChapter ? handleUpdateChapter() : handleAddChapter()}
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (editingChapter) {
                        handleNavigateToChapter('next');
                      } else {
                        // Save current and create next
                        handleNavigateToChapter('next');
                      }
                    }}
                    disabled={!newChapter.title || !newChapter.content}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      !newChapter.title || !newChapter.content
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                    }`}
                  >
                    <span>{editingChapter && currentChapterIndex < chapters.length - 1 ? 'Save & Next' : 'Add & New'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Writing Guide Modal */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowGuide(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-600" />
                Story Writing Guide
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Writing Tips */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Writing Tips
                </h4>
                <ul className="space-y-2">
                  {getWritingTips().map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-primary-500 font-bold mt-0.5">{index + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example Story Structure */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Story Structure</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">Beginning</div>
                    <p className="text-sm text-blue-800">Introduce your characters and setting. What's happening? Where are they?</p>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">Middle</div>
                    <p className="text-sm text-blue-800">What problem or adventure happens? How do your characters react?</p>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">End</div>
                    <p className="text-sm text-blue-800">How is the problem solved? What did your characters learn?</p>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Example</h4>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900 mb-2 font-semibold">Beginning:</p>
                  <p className="text-sm text-purple-800 italic mb-4">
                    "Once upon a time, in a deep forest, there lived a kind witch named Luna. She loved helping animals find their way home."
                  </p>
                  <p className="text-sm text-purple-900 mb-2 font-semibold">Middle:</p>
                  <p className="text-sm text-purple-800 italic mb-4">
                    "One day, a terrible storm destroyed the animals' homes. Luna used her magic to help rebuild them."
                  </p>
                  <p className="text-sm text-purple-900 mb-2 font-semibold">End:</p>
                  <p className="text-sm text-purple-800 italic">
                    "All the animals thanked Luna and learned that kindness is the most powerful magic of all."
                  </p>
                </div>
              </div>

              {/* Check Example Story */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900 mb-2">
                  <strong>💡 Tip:</strong> Check out the example story "The Witch in the Forest" in your library to see how a complete story is written!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                Got it!
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
