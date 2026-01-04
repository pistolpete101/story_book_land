'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowLeft, Save, Plus, Trash2, Edit3, Image as ImageIcon, X } from 'lucide-react';
import { saveUserStory } from '@/lib/storage';

interface StoryEditViewProps {
  user: User;
  story: any;
  onBack: () => void;
  onSave: (updatedStory: any) => void;
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

interface Character {
  id: string;
  name: string;
  description: string;
  personality: {
    traits: string[];
    likes: string[];
    dislikes: string[];
  };
  appearance: {
    hairColor: string;
    eyeColor: string;
    clothing: string;
    accessories: string[];
  };
  role: 'protagonist' | 'antagonist' | 'supporting' | 'narrator';
  age?: number;
  species?: string;
  powers?: string[];
}

export default function StoryEditView({ user, story, onBack, onSave }: StoryEditViewProps) {
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [genre, setGenre] = useState(story.genre || '');
  const [ageRange, setAgeRange] = useState(story.ageRange || { min: 4, max: 8 });
  const [characters, setCharacters] = useState<Character[]>(story.characters || []);
  const [chapters, setChapters] = useState<StoryChapter[]>(story.chapters || story.pages || []);
  const [coverImage, setCoverImage] = useState(story.coverImage || '');
  const [coverImageBack, setCoverImageBack] = useState(story.coverImageBack || '');

  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: '',
    description: '',
    personality: { traits: [], likes: [], dislikes: [] },
    appearance: { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
    role: 'protagonist',
    age: 8,
    species: 'human',
    powers: [],
  });

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<StoryChapter | null>(null);
  const [newChapter, setNewChapter] = useState<Partial<StoryChapter>>({
    title: '',
    content: '',
    layout: 'image-text',
    image: undefined,
    characters: [],
    settings: { location: '', timeOfDay: '', weather: '' },
  });

  const genres = [
    { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♀️' },
    { id: 'mystery', name: 'Mystery', emoji: '🔍' },
    { id: 'science-fiction', name: 'Science Fiction', emoji: '🚀' },
    { id: 'fairy-tale', name: 'Fairy Tale', emoji: '👑' },
    { id: 'animal', name: 'Animal Stories', emoji: '🐰' },
    { id: 'friendship', name: 'Friendship', emoji: '🤝' },
    { id: 'magic', name: 'Magic', emoji: '✨' },
  ];

  const ageRangeOptions = [
    { min: 4, max: 6, label: '4-6 years' },
    { min: 6, max: 8, label: '6-8 years' },
    { min: 8, max: 12, label: '8-12 years' },
  ];

  const personalityTraits = [
    'Brave', 'Kind', 'Funny', 'Smart', 'Curious', 'Shy', 'Adventurous', 'Creative',
    'Loyal', 'Honest', 'Playful', 'Wise', 'Energetic', 'Calm', 'Friendly', 'Mysterious'
  ];

  const speciesOptions = [
    'Human', 'Animal', 'Robot', 'Alien', 'Fairy', 'Dragon', 'Wizard', 'Princess', 'Prince'
  ];

  const timeOfDayOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Dawn', 'Dusk'];
  const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy', 'Stormy'];

  const handleSave = () => {
    const updatedStory = {
      ...story,
      title,
      description,
      genre,
      ageRange,
      characters,
      chapters,
      coverImage,
      coverImageBack,
      updatedAt: new Date(),
    };
    
    saveUserStory(user.id, updatedStory);
    onSave(updatedStory);
    onBack();
  };

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCharacter.name!,
        description: newCharacter.description!,
        personality: newCharacter.personality || { traits: [], likes: [], dislikes: [] },
        appearance: newCharacter.appearance || { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
        role: newCharacter.role || 'protagonist',
        age: newCharacter.age || 8,
        species: newCharacter.species || 'human',
        powers: newCharacter.powers || [],
      };
      setCharacters([...characters, character]);
      setNewCharacter({
        name: '',
        description: '',
        personality: { traits: [], likes: [], dislikes: [] },
        appearance: { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
        role: 'protagonist',
        age: 8,
        species: 'human',
        powers: [],
      });
      setShowCharacterForm(false);
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setNewCharacter(character);
    setShowCharacterForm(true);
  };

  const handleUpdateCharacter = () => {
    if (editingCharacter && newCharacter.name && newCharacter.description) {
      setCharacters(characters.map(c => c.id === editingCharacter.id ? {
        ...editingCharacter,
        ...newCharacter,
        id: editingCharacter.id,
      } as Character : c));
      setEditingCharacter(null);
      setNewCharacter({
        name: '',
        description: '',
        personality: { traits: [], likes: [], dislikes: [] },
        appearance: { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
        role: 'protagonist',
        age: 8,
        species: 'human',
        powers: [],
      });
      setShowCharacterForm(false);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
  };

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.content) {
      const chapter: StoryChapter = {
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber: chapters.length + 1,
        title: newChapter.title!,
        content: newChapter.content!,
        layout: newChapter.layout || 'image-text',
        image: newChapter.image,
        characters: newChapter.characters || [],
        settings: newChapter.settings || { location: '', timeOfDay: '', weather: '' },
      };
      setChapters([...chapters, chapter]);
      setNewChapter({
        title: '',
        content: '',
        layout: 'image-text',
        image: undefined,
        characters: [],
        settings: { location: '', timeOfDay: '', weather: '' },
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
      setChapters(chapters.map(c => c.id === editingChapter.id ? {
        ...editingChapter,
        ...newChapter,
        id: editingChapter.id,
        chapterNumber: editingChapter.chapterNumber,
      } as StoryChapter : c));
      setEditingChapter(null);
      setNewChapter({
        title: '',
        content: '',
        layout: 'image-text',
        image: undefined,
        characters: [],
        settings: { location: '', timeOfDay: '', weather: '' },
      });
      setShowChapterForm(false);
    }
  };

  const handleDeleteChapter = (id: string) => {
    const updatedChapters = chapters.filter(c => c.id !== id).map((c, idx) => ({
      ...c,
      chapterNumber: idx + 1,
    }));
    setChapters(updatedChapters);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'coverBack' | 'chapter') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        if (type === 'cover') {
          setCoverImage(imageDataUrl);
        } else if (type === 'coverBack') {
          setCoverImageBack(imageDataUrl);
        } else if (type === 'chapter') {
          setNewChapter(prev => ({ ...prev, image: imageDataUrl }));
        }
      };
      reader.onerror = () => {
        alert('Failed to load image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Edit Story</h1>
                <p className="text-sm text-gray-600">Edit all story details in one place</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Story Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Story Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter story title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Describe your story..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a genre</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range *
                </label>
                <select
                  value={`${ageRange.min}-${ageRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setAgeRange({ min, max });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  {ageRangeOptions.map((range) => (
                    <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cover Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cover Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front Cover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front Cover
              </label>
              {coverImage ? (
                <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  <img src={coverImage} alt="Front Cover" className="object-cover w-full h-full" />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                </label>
              )}
            </div>

            {/* Back Cover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back Cover (Optional)
              </label>
              {coverImageBack ? (
                <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  <img src={coverImageBack} alt="Back Cover" className="object-cover w-full h-full" />
                  <button
                    onClick={() => setCoverImageBack('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverBack')} />
                </label>
              )}
            </div>
          </div>
        </motion.div>

        {/* Characters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Characters ({characters.length})</h2>
            <button
              onClick={() => {
                setEditingCharacter(null);
                setNewCharacter({
                  name: '',
                  description: '',
                  personality: { traits: [], likes: [], dislikes: [] },
                  appearance: { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
                  role: 'protagonist',
                  age: 8,
                  species: 'human',
                  powers: [],
                });
                setShowCharacterForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Character</span>
            </button>
          </div>

          {characters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {characters.map((character) => (
                <div key={character.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{character.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{character.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {character.personality?.traits?.slice(0, 3).map((trait, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditCharacter(character)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                        title="Edit character"
                      >
                        <Edit3 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors flex items-center justify-center"
                        title="Delete character"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCharacterForm && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingCharacter ? 'Edit Character' : 'Add New Character'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newCharacter.name || ''}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Character name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={newCharacter.role || 'protagonist'}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="supporting">Supporting</option>
                      <option value="narrator">Narrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newCharacter.description || ''}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your character..."
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={editingCharacter ? handleUpdateCharacter : handleAddCharacter}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    {editingCharacter ? 'Update' : 'Add'} Character
                  </button>
                  <button
                    onClick={() => {
                      setShowCharacterForm(false);
                      setEditingCharacter(null);
                      setNewCharacter({
                        name: '',
                        description: '',
                        personality: { traits: [], likes: [], dislikes: [] },
                        appearance: { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
                        role: 'protagonist',
                        age: 8,
                        species: 'human',
                        powers: [],
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Chapters ({chapters.length})</h2>
            <button
              onClick={() => {
                setEditingChapter(null);
                setNewChapter({
                  title: '',
                  content: '',
                  layout: 'image-text',
                  image: undefined,
                  characters: [],
                  settings: { location: '', timeOfDay: '', weather: '' },
                });
                setShowChapterForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          </div>

          {chapters.length > 0 && (
            <div className="space-y-4 mb-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                          {chapter.chapterNumber}
                        </span>
                        <h3 className="font-semibold text-gray-900 break-words">{chapter.title}</h3>
                        {chapter.image && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex-shrink-0">
                            Has Image
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{chapter.content}</p>
                      {chapter.settings && (chapter.settings.location || chapter.settings.timeOfDay || chapter.settings.weather) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {chapter.settings.location && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              📍 {chapter.settings.location}
                            </span>
                          )}
                          {chapter.settings.timeOfDay && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              ⏰ {chapter.settings.timeOfDay}
                            </span>
                          )}
                          {chapter.settings.weather && (
                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                              🌤️ {chapter.settings.weather}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1 sm:ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditChapter(chapter)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
                        title="Edit chapter"
                      >
                        <Edit3 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
                        title="Delete chapter"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showChapterForm && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title *
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
                    Content *
                  </label>
                  <textarea
                    value={newChapter.content || ''}
                    onChange={(e) => setNewChapter(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={6}
                    placeholder="Write your chapter content..."
                  />
                </div>

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
                      placeholder="e.g., Forest, Castle"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select weather</option>
                      {weatherOptions.map((weather) => (
                        <option key={weather} value={weather}>{weather}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Characters in this Chapter
                  </label>
                  {characters.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {characters.map((char) => (
                        <label key={char.id} className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={newChapter.characters?.includes(char.id) || false}
                            onChange={(e) => {
                              const currentChars = newChapter.characters || [];
                              if (e.target.checked) {
                                setNewChapter(prev => ({ ...prev, characters: [...currentChars, char.id] }));
                              } else {
                                setNewChapter(prev => ({ ...prev, characters: currentChars.filter(id => id !== char.id) }));
                              }
                            }}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm">{char.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No characters created yet. Add characters above first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="image-text"
                        checked={newChapter.layout === 'image-text'}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, layout: e.target.value as any }))}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">Image + Text</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="text-image"
                        checked={newChapter.layout === 'text-image'}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, layout: e.target.value as any }))}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">Text + Image</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Image (Optional)
                  </label>
                  {newChapter.image ? (
                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                      <img src={newChapter.image} alt="Chapter Image" className="object-cover w-full h-full" />
                      <button
                        onClick={() => setNewChapter(prev => ({ ...prev, image: undefined }))}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'chapter')} />
                    </label>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={editingChapter ? handleUpdateChapter : handleAddChapter}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    {editingChapter ? 'Update' : 'Add'} Chapter
                  </button>
                  <button
                    onClick={() => {
                      setShowChapterForm(false);
                      setEditingChapter(null);
                      setNewChapter({
                        title: '',
                        content: '',
                        layout: 'image-text',
                        image: undefined,
                        characters: [],
                        settings: { location: '', timeOfDay: '', weather: '' },
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

