'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface TitleInputViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TitleInputView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  isFirstStep,
  isLastStep,
}: TitleInputViewProps) {
  const [title, setTitle] = useState(storyData.title || '');
  const [description, setDescription] = useState(storyData.description || '');

  const handleNext = () => {
    onComplete({ title, description });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">📖</div>
        <h2 className="text-4xl font-bold text-gradient mb-4">
          What's your story about?
        </h2>
        <p className="text-xl text-gray-600">
          Start by giving your story a title and a brief description
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Title Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Story Title</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should we call your story?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your amazing story title..."
                maxLength={100}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {title.length}/100 characters
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Story Description</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us what your story is about (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Describe your story in a few sentences..."
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {description.length}/500 characters
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8 bg-gradient-to-r from-primary-50 to-secondary-50"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Story Preview
            </h3>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    by {user.name}
                  </p>
                </div>
              </div>
              
              {description && (
                <p className="text-gray-700 mb-4">
                  {description}
                </p>
              )}
              
              <div className="text-sm text-gray-500">
                Ready to create your story!
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
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
          <div className="text-sm text-gray-500 mb-1">Story Title</div>
          <div className="text-lg font-bold text-primary-600">
            {title ? title : 'Not set'}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!title.trim()}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            !title.trim()
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
