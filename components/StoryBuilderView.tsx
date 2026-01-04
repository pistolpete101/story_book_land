'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import TitleInputView from './StoryBuilder/TitleInputView';
import GenreSelectionView from './StoryBuilder/GenreSelectionView';
import CharacterCreationView from './StoryBuilder/CharacterCreationView';
import StoryWritingView from './StoryBuilder/StoryWritingView';
import PreviewPublishView from './StoryBuilder/PreviewPublishView';
import { getStoryDraft, saveStoryDraft, clearStoryDraft, saveUserStory } from '@/lib/storage';

interface StoryBuilderViewProps {
  user: User;
  onBack: () => void;
  onStoryPublished?: (story: any) => void;
  editStory?: any; // Story to edit
}

const initialStoryData = {
  genre: '',
  ageRange: { min: 4, max: 8 },
  characters: [],
  chapters: [],
  title: '',
  description: '',
  coverImage: '',
  coverImageBack: '',
  settings: {
    location: '',
    timePeriod: '',
    mood: '',
  },
};

export default function StoryBuilderView({ user, onBack, onStoryPublished, editStory }: StoryBuilderViewProps) {
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
      id: 'preview',
      title: 'Preview & Publish',
      description: 'Review your story before sharing it',
      component: PreviewPublishView,
    },
  ];

  // Start at step 0 for new stories
  const [currentStep, setCurrentStep] = useState(() => {
    // If editing a story, always start at the beginning (step 0)
    if (editStory) {
      return 0;
    }
    // Don't load draft step - always start fresh for new stories
    return 0;
  });

  const [storyData, setStoryData] = useState(() => {
    // If editing a story, load it
    if (editStory) {
      return {
        ...initialStoryData,
        ...editStory,
        id: editStory.id, // Preserve the story ID
      };
    }
    // Don't load draft on mount - start fresh for new stories
    // Drafts are only loaded when explicitly continuing a draft
    return initialStoryData;
  });

  // Update storyData when editStory prop changes
  useEffect(() => {
    if (editStory) {
      setStoryData({
        ...initialStoryData,
        ...editStory,
        id: editStory.id,
        // Ensure chapters are properly mapped (chapters vs pages)
        chapters: editStory.chapters || editStory.pages || [],
      });
      // Always start at step 0 when editing
      setCurrentStep(0);
    }
  }, [editStory]);

  // Listen for edit story event (for navigation)
  useEffect(() => {
    const handleEditStory = (event: CustomEvent) => {
      const startAtBeginning = event.detail?.startAtBeginning;
      // If startAtBeginning flag is set, go to first step (title)
      if (startAtBeginning) {
        setCurrentStep(0);
      }
    };
    window.addEventListener('editStory', handleEditStory as EventListener);
    return () => window.removeEventListener('editStory', handleEditStory as EventListener);
  }, []);

  // Auto-save draft whenever storyData or currentStep changes
  useEffect(() => {
    // Only save if there's meaningful data
    const hasData = storyData.title || storyData.genre || storyData.chapters?.length > 0 || storyData.characters?.length > 0;
    if (hasData) {
      // Save to draft storage
      saveStoryDraft(user.id, {
        data: storyData,
        lastStep: steps[currentStep]?.id || 'title',
        updatedAt: new Date().toISOString(),
      });

      // Also save as a draft story in the library if there's a title
      if (storyData.title) {
        const draftStory = {
          id: storyData.id || `draft-${Date.now()}`,
          title: storyData.title,
          author: user.name,
          genre: storyData.genre || 'Unknown',
          coverImage: storyData.coverImage || '',
          coverImageBack: storyData.coverImageBack || '',
          readingTime: Math.ceil((storyData.chapters?.length || 0) * 2),
          difficulty: 'easy' as const,
          isPublished: false,
          progress: 0,
          rating: 0,
          lastRead: 'Never',
          pages: storyData.chapters?.length || 0,
          ageRange: storyData.ageRange || { min: 4, max: 8 },
          chapters: storyData.chapters || [],
          characters: storyData.characters || [],
          description: storyData.description || '',
          settings: storyData.settings || {},
          status: 'draft',
          createdAt: storyData.createdAt || new Date(),
          updatedAt: new Date(),
        };
        saveUserStory(user.id, draftStory as any);
      }
    }
  }, [storyData, currentStep, user.id, user.name]);

  // Save on unmount or when navigating away
  useEffect(() => {
    return () => {
      // Cleanup: save draft when component unmounts
      const hasData = storyData.title || storyData.genre || storyData.chapters?.length > 0 || storyData.characters?.length > 0;
      if (hasData) {
        saveStoryDraft(user.id, {
          data: storyData,
          lastStep: steps[currentStep]?.id || 'title',
          updatedAt: new Date().toISOString(),
        });
      }
    };
  }, []); // Empty deps - only run on unmount

  // Enhanced onBack handler that saves before leaving
  const handleBackWithSave = () => {
    const hasData = storyData.title || storyData.genre || storyData.chapters?.length > 0 || storyData.characters?.length > 0;
    if (hasData) {
      saveStoryDraft(user.id, {
        data: storyData,
        lastStep: steps[currentStep]?.id || 'title',
        updatedAt: new Date().toISOString(),
      });
    }
    onBack();
  };

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
    setStoryData((prev: typeof initialStoryData) => ({ ...prev, ...stepData }));
  };

  const handleStoryComplete = (finalStoryData?: any) => {
    // Use the passed finalStoryData, or get the latest storyData
    const storyToPublish = finalStoryData || storyData;
    
    // If editing, preserve the original ID
    if (editStory && editStory.id) {
      storyToPublish.id = editStory.id;
    } else if (!storyToPublish.id) {
      storyToPublish.id = Math.random().toString(36).substr(2, 9);
    }
    
    // Ensure we have all required fields
    const completeStory = {
      ...storyToPublish,
      status: storyToPublish.status || 'draft',
      publishedAt: storyToPublish.status === 'published' ? (storyToPublish.publishedAt || new Date()) : undefined,
      id: storyToPublish.id,
    };
    
    // Save the story (whether draft or published)
    if (completeStory.title) {
      const storyToSave = {
        ...completeStory,
        author: typeof completeStory.author === 'string' ? completeStory.author : user.name,
        isPublished: completeStory.status === 'published',
        pages: completeStory.chapters?.length || 0,
        readingTime: Math.ceil((completeStory.chapters?.length || 0) * 2),
        difficulty: 'easy' as const,
        progress: 0,
        rating: completeStory.rating || 0,
        lastRead: 'Never',
        ageRange: completeStory.ageRange || { min: 4, max: 8 },
        createdAt: completeStory.createdAt || new Date(),
        updatedAt: new Date(),
      };
      saveUserStory(user.id, storyToSave as any);
    }
    
    // Only clear draft if publishing (not saving as draft)
    if (completeStory.status === 'published') {
      clearStoryDraft(user.id);
    }
    
    if (onStoryPublished) {
      onStoryPublished(completeStory);
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
                onClick={handleBackWithSave}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
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
