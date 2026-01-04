'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Plus, Trash2, Edit3, Save } from 'lucide-react';

interface CharacterCreationViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
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

export default function CharacterCreationView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  isFirstStep,
  isLastStep,
}: CharacterCreationViewProps) {
  const [characters, setCharacters] = useState<Character[]>(storyData.characters || []);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: '',
    description: '',
    personality: {
      traits: [],
      likes: [],
      dislikes: [],
    },
    appearance: {
      hairColor: '',
      eyeColor: '',
      clothing: '',
      accessories: [],
    },
    role: 'protagonist',
    age: 8,
    species: 'human',
    powers: [],
  });

  const personalityTraits = [
    'Brave', 'Kind', 'Funny', 'Smart', 'Curious', 'Shy', 'Adventurous', 'Creative',
    'Loyal', 'Honest', 'Playful', 'Wise', 'Energetic', 'Calm', 'Friendly', 'Mysterious'
  ];

  const speciesOptions = [
    'Human', 'Animal', 'Robot', 'Alien', 'Fairy', 'Dragon', 'Wizard', 'Princess', 'Prince'
  ];

  const powerOptions = [
    'Flying', 'Magic', 'Super Strength', 'Invisibility', 'Telepathy', 'Healing',
    'Shape Shifting', 'Time Control', 'Element Control', 'Animal Communication'
  ];

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCharacter.name,
        description: newCharacter.description,
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
      setCharacters(characters.map(c => 
        c.id === editingCharacter.id 
          ? { ...c, ...newCharacter } as Character
          : c
      ));
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

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(characters.filter(c => c.id !== characterId));
  };

  const handleTraitToggle = (trait: string, type: 'traits' | 'likes' | 'dislikes') => {
    const currentTraits = newCharacter.personality?.[type] || [];
    const updatedTraits = currentTraits.includes(trait)
      ? currentTraits.filter(t => t !== trait)
      : [...currentTraits, trait];
    
    setNewCharacter(prev => ({
      ...prev,
      personality: {
        traits: prev.personality?.traits || [],
        likes: prev.personality?.likes || [],
        dislikes: prev.personality?.dislikes || [],
        [type]: updatedTraits,
      },
    }));
  };

  const handleNext = () => {
    onComplete({ characters });
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Create Your Characters
        </h2>
        <p className="text-xl text-gray-600">
          Design the heroes, villains, and friends who will bring your story to life
        </p>
      </motion.div>

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {character.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{character.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{character.role}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCharacter(character)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCharacter(character.id)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-600 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{character.description}</p>
            <div className="flex flex-wrap gap-2">
              {character.personality.traits.slice(0, 3).map((trait, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {trait}
                </span>
              ))}
              {character.personality.traits.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{character.personality.traits.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Add Character Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCharacterForm(true)}
          className="card p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors flex flex-col items-center justify-center min-h-[200px]"
        >
          <Plus className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Add Character</h3>
          <p className="text-sm text-gray-500 text-center">
            Create a new character for your story
          </p>
        </motion.button>
      </div>

      {/* Character Form Modal */}
      {showCharacterForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCharacter ? 'Edit Character' : 'Create New Character'}
            </h3>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Character Name
                  </label>
                  <input
                    type="text"
                    value={newCharacter.name || ''}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter character name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newCharacter.role || 'protagonist'}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="protagonist">Hero/Protagonist</option>
                    <option value="antagonist">Villain/Antagonist</option>
                    <option value="supporting">Supporting Character</option>
                    <option value="narrator">Narrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCharacter.description || ''}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your character..."
                />
              </div>

              {/* Personality Traits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personality Traits
                </label>
                <div className="flex flex-wrap gap-2">
                  {personalityTraits.map((trait) => (
                    <button
                      key={trait}
                      onClick={() => handleTraitToggle(trait, 'traits')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newCharacter.personality?.traits?.includes(trait)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              {/* Species and Powers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species
                  </label>
                  <select
                    value={newCharacter.species || 'human'}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, species: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {speciesOptions.map((species) => (
                      <option key={species} value={species.toLowerCase()}>
                        {species}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newCharacter.age || 8}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8">
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
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCharacter ? handleUpdateCharacter : handleAddCharacter}
                disabled={!newCharacter.name || !newCharacter.description}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !newCharacter.name || !newCharacter.description
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {editingCharacter ? 'Update Character' : 'Add Character'}
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
          <div className="text-sm text-gray-500 mb-1">Characters Created</div>
          <div className="text-lg font-bold text-primary-600">{characters.length}</div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all btn-primary"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
