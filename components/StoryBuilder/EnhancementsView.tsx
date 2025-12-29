'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Music, Zap, Volume2, Sparkles, Check, Mic } from 'lucide-react';
import VoiceRecordingView from './VoiceRecordingView';

interface EnhancementsViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function EnhancementsView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  isFirstStep,
  isLastStep,
}: EnhancementsViewProps) {
  const [enhancements, setEnhancements] = useState(storyData.enhancements || {
    music: false,
    animations: false,
    voiceNarration: false,
    soundEffects: false,
    interactiveElements: false,
    autoPlay: false,
  });
  const [showVoiceRecording, setShowVoiceRecording] = useState(false);
  const [voiceRecordings, setVoiceRecordings] = useState<Blob[]>([]);

  const enhancementOptions = [
    {
      id: 'music',
      title: 'Background Music',
      description: 'Add soothing background music to enhance the reading experience',
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      features: ['Ambient sounds', 'Genre-appropriate music', 'Volume control'],
    },
    {
      id: 'animations',
      title: 'Page Animations',
      description: 'Smooth transitions and subtle animations between pages',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: ['Page flip effects', 'Character animations', 'Smooth transitions'],
    },
    {
      id: 'voiceNarration',
      title: 'Voice Narration',
      description: 'Record your own voice or use text-to-speech',
      icon: Volume2,
      color: 'from-green-500 to-green-600',
      features: ['Record with microphone', 'Text-to-speech option', 'Character voices', 'Reading speed control'],
    },
    {
      id: 'soundEffects',
      title: 'Sound Effects',
      description: 'Immersive sound effects that match your story scenes',
      icon: Sparkles,
      color: 'from-yellow-500 to-yellow-600',
      features: ['Environmental sounds', 'Action effects', 'Atmospheric audio'],
    },
    {
      id: 'interactiveElements',
      title: 'Interactive Elements',
      description: 'Clickable elements and mini-games within the story',
      icon: Check,
      color: 'from-pink-500 to-pink-600',
      features: ['Hidden surprises', 'Character interactions', 'Story choices'],
    },
    {
      id: 'autoPlay',
      title: 'Auto-Play Mode',
      description: 'Automatically advance pages for a movie-like experience',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      features: ['Timed page turns', 'Customizable speed', 'Pause anytime'],
    },
  ];

  const handleEnhancementToggle = (enhancementId: string) => {
    setEnhancements((prev: Record<string, boolean>) => ({
      ...prev,
      [enhancementId]: !prev[enhancementId],
    }));
  };

  const handleVoiceRecordingComplete = (audioBlob: Blob) => {
    setVoiceRecordings(prev => [...prev, audioBlob]);
    setShowVoiceRecording(false);
  };

  const handleNext = () => {
    onComplete({ enhancements });
    onNext();
  };

  const selectedCount = Object.values(enhancements).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Add Magical Enhancements
        </h2>
        <p className="text-xl text-gray-600">
          Make your story even more engaging with these special features
        </p>
      </motion.div>

      {/* Enhancement Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {enhancementOptions.map((enhancement, index) => (
          <motion.div
            key={enhancement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`card p-6 cursor-pointer transition-all duration-200 ${
              enhancements[enhancement.id as keyof typeof enhancements]
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleEnhancementToggle(enhancement.id)}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${enhancement.color} flex items-center justify-center`}>
                <enhancement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{enhancement.title}</h3>
                <p className="text-sm text-gray-600">{enhancement.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                enhancements[enhancement.id as keyof typeof enhancements]
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {enhancements[enhancement.id as keyof typeof enhancements] && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {enhancement.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {enhancement.id === 'voiceNarration' && enhancements.voiceNarration && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowVoiceRecording(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-sm font-medium">Record Voice</span>
                  </button>
                  {voiceRecordings.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      {voiceRecordings.length} recording{voiceRecordings.length !== 1 ? 's' : ''} saved
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Enhancements Summary */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-secondary-50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Selected Enhancements ({selectedCount})
          </h3>
          <div className="flex flex-wrap gap-2">
            {enhancementOptions
              .filter(enhancement => enhancements[enhancement.id as keyof typeof enhancements])
              .map((enhancement) => (
                <span
                  key={enhancement.id}
                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                >
                  {enhancement.title}
                </span>
              ))}
          </div>
        </motion.div>
      )}

      {/* Enhancement Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Preview Your Enhanced Story
        </h3>
        
        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sample Page</h4>
                <p className="text-sm text-gray-600">Your story with enhancements</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "Once upon a time, in a magical forest far, far away..."
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {enhancements.music && (
                <span className="flex items-center space-x-1">
                  <Music className="w-4 h-4" />
                  <span>Music</span>
                </span>
              )}
              {enhancements.voiceNarration && (
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Narration</span>
                </span>
              )}
              {enhancements.animations && (
                <span className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Animations</span>
                </span>
              )}
              {enhancements.soundEffects && (
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Sound Effects</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Your story will be enhanced with the selected features to create an immersive reading experience.
          </p>
          <div className="text-sm text-gray-500">
            * All enhancements are optional and can be toggled on/off during reading
          </div>
        </div>
      </motion.div>

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
          <div className="text-sm text-gray-500 mb-1">Enhancements Selected</div>
          <div className="text-lg font-bold text-primary-600">{selectedCount}</div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold btn-primary"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Voice Recording Modal */}
      {showVoiceRecording && (
        <VoiceRecordingView
          onRecordingComplete={handleVoiceRecordingComplete}
          onClose={() => setShowVoiceRecording(false)}
        />
      )}
    </div>
  );
}
