'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Check } from 'lucide-react';

interface GenreSelectionViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function GenreSelectionView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  isFirstStep,
  isLastStep,
}: GenreSelectionViewProps) {
  const [selectedGenre, setSelectedGenre] = useState(storyData.genre || '');
  const [selectedAgeRange, setSelectedAgeRange] = useState(storyData.ageRange || { min: 4, max: 8 });

  const genres = [
    {
      id: 'adventure',
      name: 'Adventure',
      emoji: '🗺️',
      description: 'Exciting journeys and thrilling quests',
      detailedDescription: 'Perfect for young explorers! Adventure stories feature brave heroes who embark on exciting journeys, discover new places, and overcome challenges. Think treasure hunts, mountain climbing, jungle exploration, and daring rescues. These stories teach courage, problem-solving, and the value of perseverance.',
      color: 'from-blue-500 to-blue-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      emoji: '🧙‍♀️',
      description: 'Magic, dragons, and enchanted worlds',
      detailedDescription: 'Step into magical realms where anything is possible! Fantasy stories feature wizards, dragons, fairies, and magical creatures in enchanted forests, castles, and mystical lands. These stories spark imagination and creativity while teaching important life lessons through magical adventures.',
      color: 'from-purple-500 to-purple-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'mystery',
      name: 'Mystery',
      emoji: '🔍',
      description: 'Puzzles, clues, and detective work',
      detailedDescription: 'Become a detective and solve puzzling mysteries! Mystery stories challenge young minds with clues, hidden secrets, and brain-teasing puzzles. Perfect for developing critical thinking skills, attention to detail, and logical reasoning while having fun solving exciting cases.',
      color: 'from-gray-500 to-gray-600',
      ageRanges: [
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'science-fiction',
      name: 'Science Fiction',
      emoji: '🚀',
      description: 'Space, robots, and futuristic adventures',
      detailedDescription: 'Blast off into the future with amazing technology! Science fiction stories explore space travel, robots, aliens, time machines, and futuristic inventions. These stories inspire curiosity about science and technology while imagining what the future might hold.',
      color: 'from-cyan-500 to-cyan-600',
      ageRanges: [
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'fairy-tale',
      name: 'Fairy Tale',
      emoji: '👸',
      description: 'Princesses, princes, and magical kingdoms',
      detailedDescription: 'Enter the world of classic fairy tales with princesses, princes, magical kingdoms, and happily-ever-afters! These timeless stories feature brave heroes, wise fairies, talking animals, and magical transformations that teach important values like kindness, courage, and believing in yourself.',
      color: 'from-pink-500 to-pink-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
      ],
    },
    {
      id: 'animal',
      name: 'Animal Stories',
      emoji: '🐰',
      description: 'Talking animals and their adventures',
      detailedDescription: 'Meet adorable talking animals who go on amazing adventures! Animal stories feature cute creatures like rabbits, bears, cats, and dogs who talk, think, and feel just like humans. These heartwarming tales teach empathy, friendship, and the importance of caring for all living things.',
      color: 'from-green-500 to-green-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'friendship',
      name: 'Friendship',
      emoji: '🤝',
      description: 'Stories about friends and relationships',
      detailedDescription: 'Celebrate the power of friendship and relationships! These heartwarming stories focus on how friends help each other, solve problems together, and support one another through good times and challenges. Perfect for teaching empathy, cooperation, and the value of true friendship.',
      color: 'from-yellow-500 to-yellow-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
    {
      id: 'magic',
      name: 'Magic',
      emoji: '✨',
      description: 'Wizards, spells, and magical powers',
      detailedDescription: 'Discover the wonder of magic and magical powers! Magic stories feature young wizards learning spells, magical schools, enchanted objects, and the responsibility that comes with having special powers. These stories teach that with great power comes great responsibility and the importance of using abilities for good.',
      color: 'from-indigo-500 to-indigo-600',
      ageRanges: [
        { min: 4, max: 6, label: '4-6 years' },
        { min: 6, max: 8, label: '6-8 years' },
        { min: 8, max: 12, label: '8-12 years' },
      ],
    },
  ];

  const selectedGenreData = genres.find(g => g.id === selectedGenre);

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    const genre = genres.find(g => g.id === genreId);
    if (genre) {
      // Set default age range for the genre
      setSelectedAgeRange(genre.ageRanges[0]);
    }
  };

  const handleAgeRangeSelect = (ageRange: { min: number; max: number }) => {
    setSelectedAgeRange(ageRange);
  };

  const handleNext = () => {
    onComplete({
      genre: selectedGenre,
      ageRange: selectedAgeRange,
    });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-4xl mb-3">📚</div>
        <h2 className="text-3xl font-bold text-gradient mb-3">
          What kind of story do you want to create?
        </h2>
        <p className="text-lg text-gray-600">
          Choose a genre that excites you and matches your age group
        </p>
      </motion.div>

      {/* Genre Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {genres.map((genre, index) => (
          <motion.button
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGenreSelect(genre.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedGenre === genre.id
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${genre.color} flex items-center justify-center text-xl`}>
                {genre.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{genre.name}</h3>
                <p className="text-sm text-gray-600">{genre.description}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{genre.detailedDescription}</p>
            {selectedGenre === genre.id && (
              <div className="flex items-center text-primary-600 font-medium">
                <Check className="w-5 h-5 mr-2" />
                Selected
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Age Range Selection */}
      {selectedGenre && selectedGenreData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Choose the age range for your story
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedGenreData.ageRanges.map((ageRange, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAgeRangeSelect(ageRange)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAgeRange.min === ageRange.min && selectedAgeRange.max === ageRange.max
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {ageRange.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    Perfect for {ageRange.min}-{ageRange.max} year olds
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isFirstStep
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Selected Genre</div>
          <div className="text-lg font-bold text-primary-600">
            {selectedGenre ? selectedGenreData?.name : 'None selected'}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedGenre}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            !selectedGenre
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
