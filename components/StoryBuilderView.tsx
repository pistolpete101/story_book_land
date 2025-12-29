'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import TitleInputView from './StoryBuilder/TitleInputView';
import GenreSelectionView from './StoryBuilder/GenreSelectionView';
import CharacterCreationView from './StoryBuilder/CharacterCreationView';
import StoryWritingView from './StoryBuilder/StoryWritingView';
import EnhancementsView from './StoryBuilder/EnhancementsView';
import PreviewPublishView from './StoryBuilder/PreviewPublishView';
import FullStoryPreviewView from './StoryBuilder/FullStoryPreviewView';

interface StoryBuilderViewProps {
  user: User;
  onBack: () => void;
  onStoryPublished?: (story: any) => void;
}

export default function StoryBuilderView({ user, onBack, onStoryPublished }: StoryBuilderViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyData, setStoryData] = useState({
    genre: '',
    ageRange: { min: 4, max: 8 },
    characters: [],
    chapters: [],
    title: '',
    description: '',
    coverImage: '',
    settings: {
      location: '',
      timePeriod: '',
      mood: '',
    },
    enhancements: {
      music: false,
      animations: false,
      voiceNarration: false,
      soundEffects: false,
    },
  });

  const steps = [
    {
      id: 'title',
      title: 'Story Title',
      description: 'Give your story a name',
      component: TitleInputView,
    },
    {
      id: 'genre',
      title: 'Choose Genre',
      description: 'What type of story do you want to create?',
      component: GenreSelectionView,
    },
    {
      id: 'character',
      title: 'Create Characters',
      description: 'Design the main characters for your story',
      component: CharacterCreationView,
    },
    {
      id: 'story',
      title: 'Write Your Story',
      description: 'Bring your story to life with words and images',
      component: StoryWritingView,
    },
    {
      id: 'enhancements',
      title: 'Add Enhancements',
      description: 'Make your story even more magical',
      component: EnhancementsView,
    },
    {
      id: 'preview',
      title: 'Preview & Publish',
      description: 'Review your story before sharing it',
      component: PreviewPublishView,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: any) => {
    setStoryData(prev => ({ ...prev, ...stepData }));
  };

  const handleStoryComplete = (finalStoryData?: any) => {
    const storyToPublish = finalStoryData || storyData;
    // Story completed successfully
    
    if (onStoryPublished) {
      onStoryPublished(storyToPublish);
    } else {
      onBack();
    }
  };

  const CurrentComponent = steps[currentStep].component;

  // Handler to go back to story writing step for editing
  const handleEditStory = () => {
    // Find the story writing step index
    const storyStepIndex = steps.findIndex(step => step.id === 'story');
    if (storyStepIndex >= 0) {
      setCurrentStep(storyStepIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Story Builder</h1>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-bold text-primary-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  index <= currentStep ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStep
                      ? 'bg-primary-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent
              user={user}
              storyData={storyData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleStepComplete}
              onStoryComplete={handleStoryComplete}
              onEdit={currentStep === steps.length - 1 ? handleEditStory : undefined}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
