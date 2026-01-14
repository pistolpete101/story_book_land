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
  role: 'protagonist' | 'antagonist' | 'supporting' | 'narrator' | 'other' | string;
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
  const [customRole, setCustomRole] = useState('');
  const [customTrait, setCustomTrait] = useState('');
  const [customSpecies, setCustomSpecies] = useState('');
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

  // Role-based personality traits
  const getPersonalityTraitsForRole = (role: string) => {
    const roleLower = role.toLowerCase();
    
    if (roleLower === 'antagonist' || roleLower.includes('villain') || roleLower.includes('evil')) {
      return [
        'Cunning', 'Sneaky', 'Bold', 'Ambitious', 'Clever', 'Mysterious', 'Powerful', 'Determined',
        'Ruthless', 'Deceptive', 'Confident', 'Strategic', 'Intimidating', 'Persuasive', 'Greedy', 'Revengeful'
      ];
    } else if (roleLower === 'protagonist' || roleLower.includes('hero')) {
      return [
        'Brave', 'Kind', 'Funny', 'Smart', 'Curious', 'Adventurous', 'Creative',
        'Loyal', 'Honest', 'Playful', 'Wise', 'Energetic', 'Calm', 'Friendly', 'Determined', 'Hopeful'
      ];
    } else if (roleLower === 'supporting') {
      return [
        'Helpful', 'Friendly', 'Supportive', 'Cheerful', 'Reliable', 'Patient', 'Understanding', 'Encouraging',
        'Optimistic', 'Caring', 'Thoughtful', 'Generous', 'Cooperative', 'Trustworthy', 'Compassionate', 'Empathetic'
      ];
    } else if (roleLower === 'narrator') {
      return [
        'Wise', 'Observant', 'Thoughtful', 'Reflective', 'Calm', 'Patient', 'Insightful', 'Perceptive',
        'Eloquent', 'Philosophical', 'Analytical', 'Contemplative', 'Knowledgeable', 'Articulate', 'Meditative', 'Understanding'
      ];
    } else {
      // Default traits for custom roles
      return [
        'Brave', 'Kind', 'Funny', 'Smart', 'Curious', 'Shy', 'Adventurous', 'Creative',
        'Loyal', 'Honest', 'Playful', 'Wise', 'Energetic', 'Calm', 'Friendly', 'Mysterious'
      ];
    }
  };

  // Get current personality traits based on selected role
  const currentRole = (newCharacter.role === 'other' || newCharacter.role === undefined) 
    ? (customRole || 'protagonist') 
    : newCharacter.role;
  const personalityTraits = getPersonalityTraitsForRole(currentRole);

  const speciesOptions = [
    'Human', 'Animal', 'Robot', 'Alien', 'Fairy', 'Dragon', 'Wizard', 'Princess', 'Prince', 'Other'
  ];

  const powerOptions = [
    'Flying', 'Magic', 'Super Strength', 'Invisibility', 'Telepathy', 'Healing',
    'Shape Shifting', 'Time Control', 'Element Control', 'Animal Communication'
  ];

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      // Use custom role if "other" is selected and customRole is provided
      const finalRole = newCharacter.role === 'other' && customRole.trim() 
        ? customRole.trim() 
        : (newCharacter.role || 'protagonist');
      
      // Use custom species if "other" is selected and customSpecies is provided
      const finalSpecies = newCharacter.species === 'other' && customSpecies.trim()
        ? customSpecies.trim()
        : (newCharacter.species || 'human');
      
      const character: Character = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCharacter.name,
        description: newCharacter.description,
        personality: newCharacter.personality || { traits: [], likes: [], dislikes: [] },
        appearance: newCharacter.appearance || { hairColor: '', eyeColor: '', clothing: '', accessories: [] },
        role: finalRole,
        age: newCharacter.age || 8,
        species: finalSpecies,
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
      setCustomRole('');
      setCustomTrait('');
      setCustomSpecies('');
      setShowCharacterForm(false);
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setNewCharacter(character);
    // Check if role is a custom role (not in the standard list)
    const standardRoles = ['protagonist', 'antagonist', 'supporting', 'narrator'];
    if (character.role && !standardRoles.includes(character.role)) {
      setCustomRole(character.role);
      setNewCharacter(prev => ({ ...prev, role: 'other' }));
    } else {
      setCustomRole('');
    }
    // Check if species is a custom species (not in the standard list)
    const standardSpecies = ['human', 'animal', 'robot', 'alien', 'fairy', 'dragon', 'wizard', 'princess', 'prince'];
    if (character.species && !standardSpecies.includes(character.species.toLowerCase())) {
      setCustomSpecies(character.species);
      setNewCharacter(prev => ({ ...prev, species: 'other' }));
    } else {
      setCustomSpecies('');
    }
    setShowCharacterForm(true);
  };

  const handleUpdateCharacter = () => {
    if (editingCharacter && newCharacter.name && newCharacter.description) {
      // Use custom role if "other" is selected and customRole is provided
      const finalRole = newCharacter.role === 'other' && customRole.trim() 
        ? customRole.trim() 
        : (newCharacter.role || 'protagonist');
      
      // Use custom species if "other" is selected and customSpecies is provided
      const finalSpecies = newCharacter.species === 'other' && customSpecies.trim()
        ? customSpecies.trim()
        : (newCharacter.species || 'human');
      
      setCharacters(characters.map(c => 
        c.id === editingCharacter.id 
          ? { ...c, ...newCharacter, role: finalRole, species: finalSpecies } as Character
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
      setCustomRole('');
      setCustomTrait('');
      setCustomSpecies('');
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

  const handleAddCustomTrait = () => {
    if (customTrait.trim()) {
      const currentTraits = newCharacter.personality?.traits || [];
      if (!currentTraits.includes(customTrait.trim())) {
        setNewCharacter(prev => ({
          ...prev,
          personality: {
            traits: [...currentTraits, customTrait.trim()],
            likes: prev.personality?.likes || [],
            dislikes: prev.personality?.dislikes || [],
          },
        }));
        setCustomTrait('');
      }
    }
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
                    onChange={(e) => {
                      const newRole = e.target.value as any;
                      setNewCharacter(prev => ({ 
                        ...prev, 
                        role: newRole,
                        // Clear traits when role changes so user can select traits matching the new role
                        personality: {
                          ...prev.personality,
                          traits: []
                        }
                      }));
                      if (newRole !== 'other') {
                        setCustomRole('');
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="protagonist">Hero/Protagonist</option>
                    <option value="antagonist">Villain/Antagonist</option>
                    <option value="supporting">Supporting Character</option>
                    <option value="narrator">Narrator</option>
                    <option value="other">Other (specify)</option>
                  </select>
                  {newCharacter.role === 'other' && (
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value);
                        // Clear traits when custom role changes
                        setNewCharacter(prev => ({
                          ...prev,
                          personality: {
                            ...prev.personality,
                            traits: []
                          }
                        }));
                      }}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter custom role..."
                    />
                  )}
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
                  <span className="text-xs text-gray-500 ml-2">
                    (Traits match {newCharacter.role === 'other' && customRole ? `"${customRole}"` : newCharacter.role === 'antagonist' ? 'Villain' : newCharacter.role === 'protagonist' ? 'Hero' : newCharacter.role || 'Hero'} role)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
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
                {/* Custom Trait Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTrait}
                    onChange={(e) => setCustomTrait(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTrait();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add custom trait..."
                  />
                  <button
                    onClick={handleAddCustomTrait}
                    disabled={!customTrait.trim()}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      !customTrait.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    Add
                  </button>
                </div>
                {/* Display custom traits */}
                {newCharacter.personality?.traits?.some(trait => !personalityTraits.includes(trait)) && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 mb-2">Custom Traits:</div>
                    <div className="flex flex-wrap gap-2">
                      {newCharacter.personality.traits
                        .filter(trait => !personalityTraits.includes(trait))
                        .map((trait, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                          >
                            {trait}
                            <button
                              onClick={() => handleTraitToggle(trait, 'traits')}
                              className="hover:text-purple-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Species and Powers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species
                  </label>
                  <select
                    value={newCharacter.species || 'human'}
                    onChange={(e) => {
                      const newSpecies = e.target.value;
                      setNewCharacter(prev => ({ ...prev, species: newSpecies }));
                      if (newSpecies !== 'other') {
                        setCustomSpecies('');
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {speciesOptions.map((species) => (
                      <option key={species} value={species.toLowerCase()}>
                        {species}
                      </option>
                    ))}
                  </select>
                  {newCharacter.species === 'other' && (
                    <input
                      type="text"
                      value={customSpecies}
                      onChange={(e) => setCustomSpecies(e.target.value)}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter custom species..."
                    />
                  )}
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
                  setCustomRole('');
                  setCustomTrait('');
                  setCustomSpecies('');
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
