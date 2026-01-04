'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { ArrowRight, Eye, Edit3, Share2, Download, BookOpen, Star, Users, Clock, Image as ImageIcon, X } from 'lucide-react';

interface PreviewPublishViewProps {
  user: User;
  storyData: any;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onStoryComplete: (finalData?: any) => void;
  onEdit?: () => void; // Callback to go back to edit
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function PreviewPublishView({
  user,
  storyData,
  onNext,
  onPrevious,
  onComplete,
  onStoryComplete,
  onEdit,
  isFirstStep,
  isLastStep,
}: PreviewPublishViewProps) {
  const [storyTitle, setStoryTitle] = useState(storyData.title || '');
  const [storyDescription, setStoryDescription] = useState(storyData.description || '');
  const [coverImage, setCoverImage] = useState(storyData.coverImage || '');
  const [coverImageBack, setCoverImageBack] = useState(storyData.coverImageBack || '');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [storyStatus, setStoryStatus] = useState<'draft' | 'published' | 'in-progress' | 'completed'>(
    storyData.status || 'draft'
  );

  const handlePublish = () => {
    // Ensure author is always a string, not an object
    const authorName = typeof user === 'object' && user !== null 
      ? (user.name || 'Unknown')
      : (user || 'Unknown');
    
    // If storyData already has an author object, extract the name
    const existingAuthor = storyData.author;
    const finalAuthorName = typeof existingAuthor === 'object' && existingAuthor !== null
      ? (existingAuthor.name || authorName)
      : (existingAuthor || authorName);

    // When clicking "Publish Story", always set status to 'published'
    const finalStoryData = {
      ...storyData,
      title: storyTitle,
      description: storyDescription,
      coverImage: coverImage || '',
      coverImageBack: coverImageBack || '',
      status: 'published', // Always set to published when clicking Publish button
      isPublished: true, // Always true when publishing
      publishedAt: new Date(), // Set published date
      id: storyData.id || Math.random().toString(36).substr(2, 9),
      author: finalAuthorName, // Always a string
      readingTime: Math.ceil((storyData.chapters?.length || 0) * 2), // Estimate 2 minutes per chapter
      difficulty: 'easy',
      progress: 0,
      rating: 0,
      lastRead: 'Never',
      pages: storyData.chapters?.length || 0,
      genre: storyData.genre || 'Unknown',
    };
    // Update story data first
    onComplete(finalStoryData);
    // Then trigger story completion with the final data
    // Pass the finalStoryData directly to ensure it's used
    onStoryComplete(finalStoryData);
  };

  const handleSaveDraft = () => {
    const finalStoryData = {
      ...storyData,
      title: storyTitle,
      description: storyDescription,
      coverImage,
      coverImageBack,
      status: storyStatus,
      isPublished: storyStatus === 'published',
      publishedAt: storyStatus === 'published' ? new Date() : (storyData.publishedAt || undefined),
    };
    onComplete(finalStoryData);
    onStoryComplete(finalStoryData); // Pass finalStoryData to save it
  };

  // Save draft when going back from preview
  const handleGoBack = () => {
    // Save current preview state before going back
    const draftData = {
      ...storyData,
      title: storyTitle,
      description: storyDescription,
      coverImage,
      coverImageBack,
      status: storyStatus,
      isPublished: storyStatus === 'published',
    };
    onComplete(draftData);
    onPrevious();
  };

  if (showFullPreview) {
    // Convert chapters to pages for book view with proper page numbering
    // TOC is page 1, chapters start at page 2
    let currentPageNumber = 2; // Start after TOC page (page 1)
    const pages = storyData.chapters?.flatMap((chapter: any, chapterIndex: number) => {
      const chapterPage = {
        id: chapter.id,
        pageNumber: currentPageNumber++,
        title: chapter.title,
        content: chapter.content,
        settings: chapter.settings,
        chapterNumber: chapter.chapterNumber || chapterIndex + 1,
      };
      return [chapterPage];
    }) || [];

    // Create table of contents page with correct page numbers
    const tocPage = {
      id: 'toc',
      pageNumber: 1,
      title: 'Table of Contents',
      isTOC: true,
      chapters: storyData.chapters?.map((chapter: any, index: number) => ({
        ...chapter,
        pageNumber: index + 2, // Chapters start at page 2
      })) || [],
    };

    // Add TOC at the beginning
    const allPages = [tocPage, ...pages];

    // Group pages into pairs for book spread (2 pages side by side)
    const pagePairs: any[][] = [];
    for (let i = 0; i < allPages.length; i += 2) {
      pagePairs.push([allPages[i], allPages[i + 1] || null]);
    }

    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0 no-print">
          <button
            onClick={() => setShowFullPreview(false)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm tablet:text-base"
          >
            <ArrowRight className="w-4 h-4 tablet:w-5 tablet:h-5 rotate-180" />
            <span>Back to Preview</span>
          </button>
          <h2 className="text-lg tablet:text-xl font-bold text-gray-900">Full Story Preview</h2>
          <button
            onClick={() => {
              // Small delay to ensure DOM is ready
              requestAnimationFrame(() => {
                setTimeout(() => window.print(), 100);
              });
            }}
            className="flex items-center space-x-2 px-3 tablet:px-4 py-2 btn-primary text-sm tablet:text-base"
          >
            <Download className="w-4 h-4 tablet:w-5 tablet:h-5" />
            <span className="hidden tablet:inline">Print Book</span>
            <span className="tablet:hidden">Print</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 tablet:space-y-6 pb-6 print-container">
            {pagePairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="print-spread">
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 tablet:gap-4 print-grid">
                  {/* Left Page */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 tablet:p-6 border-2 border-amber-200 min-h-[400px] tablet:min-h-[500px] flex flex-col relative print-page print-story-page">
                    {pair[0] && (
                      <>
                        {pair[0].isTOC ? (
                          // Table of Contents Page
                          <>
                            <div className="text-center mb-4">
                              <h2 className="text-2xl tablet:text-3xl font-bold text-gray-900 mb-2">Table of Contents</h2>
                              <div className="text-sm text-gray-600">Page {pair[0].pageNumber}</div>
                            </div>
                            <div className="flex-1 bg-white/60 rounded-lg p-4 tablet:p-6 overflow-y-auto">
                              <div className="space-y-3">
                                {pair[0].chapters.map((chapter: any, idx: number) => (
                                  <div key={chapter.id || idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                                        {chapter.chapterNumber || idx + 1}
                                      </div>
                                      <span className="text-sm tablet:text-base font-medium text-gray-900">{chapter.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{chapter.pageNumber || idx + 2}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          // Regular Story Page
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                                  {pair[0].chapterNumber || pair[0].pageNumber}
                                </div>
                                <h3 className="text-lg tablet:text-xl font-bold text-gray-900">{pair[0].title}</h3>
                              </div>
                            </div>
                            <div className="flex-1 bg-white/60 rounded-lg p-4 overflow-y-auto">
                              <p className="text-sm tablet:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {pair[0].content}
                              </p>
                            </div>
                            {pair[0].settings && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {pair[0].settings.location && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                    📍 {pair[0].settings.location}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        {/* Page Number Footer */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          Page {pair[0].pageNumber}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Page */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 tablet:p-6 border-2 border-amber-200 min-h-[400px] tablet:min-h-[500px] flex flex-col relative print-page print-story-page">
                    {pair[1] ? (
                      <>
                        {pair[1].isTOC ? (
                          // Table of Contents Page
                          <>
                            <div className="text-center mb-4">
                              <h2 className="text-2xl tablet:text-3xl font-bold text-gray-900 mb-2">Table of Contents</h2>
                              <div className="text-sm text-gray-600">Page {pair[1].pageNumber}</div>
                            </div>
                            <div className="flex-1 bg-white/60 rounded-lg p-4 tablet:p-6 overflow-y-auto">
                              <div className="space-y-3">
                                {pair[1].chapters.map((chapter: any, idx: number) => (
                                  <div key={chapter.id || idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                                        {chapter.chapterNumber || idx + 1}
                                      </div>
                                      <span className="text-sm tablet:text-base font-medium text-gray-900">{chapter.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{chapter.pageNumber || idx + 2}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          // Regular Story Page
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                                  {pair[1].chapterNumber || pair[1].pageNumber}
                                </div>
                                <h3 className="text-lg tablet:text-xl font-bold text-gray-900">{pair[1].title}</h3>
                              </div>
                            </div>
                            <div className="flex-1 bg-white/60 rounded-lg p-4 overflow-y-auto">
                              <p className="text-sm tablet:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {pair[1].content}
                              </p>
                            </div>
                            {pair[1].settings && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {pair[1].settings.location && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                    📍 {pair[1].settings.location}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        {/* Page Number Footer */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          Page {pair[1].pageNumber}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        <p className="text-sm">Blank page</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2 tablet:mb-3 flex-shrink-0"
      >
        <div className="text-3xl tablet:text-4xl mb-1">🎉</div>
        <h2 className="text-xl tablet:text-2xl font-bold text-gradient mb-1">
          Preview & Publish Your Story
        </h2>
        <p className="text-sm tablet:text-base text-gray-600">
          Review your amazing story and share it with the world!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 tablet-lg:grid-cols-2 gap-4 tablet:gap-6 flex-1 overflow-hidden min-h-0">
        {/* Story Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 tablet:space-y-6 overflow-y-auto"
        >
          <div className="card p-4 tablet:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Story Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your story title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={storyDescription}
                  onChange={(e) => setStoryDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe your story..."
                />
              </div>
              
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Cover Image
                </label>
                {coverImage ? (
                  <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    <img src={coverImage} alt="Front Cover" className="object-cover w-full h-full" />
                    <button
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                    <input 
                      id="front-cover-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
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
                            setCoverImage(imageDataUrl);
                          };
                          reader.onerror = () => {
                            alert('Failed to load image. Please try again.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                )}
              </div>

              {/* Back Cover Image Upload (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back Cover Image (Optional)
                </label>
                {coverImageBack ? (
                  <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    <img src={coverImageBack} alt="Back Cover" className="object-cover w-full h-full" />
                    <button
                      onClick={() => setCoverImageBack('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                    <input 
                      id="back-cover-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
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
                            setCoverImageBack(imageDataUrl);
                          };
                          reader.onerror = () => {
                            alert('Failed to load image. Please try again.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Status
                </label>
                <select
                  value={storyStatus}
                  onChange={(e) => setStoryStatus(e.target.value as 'draft' | 'published' | 'in-progress' | 'completed')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {storyStatus === 'published' 
                    ? 'Your story will be visible to others' 
                    : storyStatus === 'draft'
                    ? 'Your story is saved but not published'
                    : storyStatus === 'in-progress'
                    ? 'Your story is being worked on'
                    : 'Your story is finished'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Story Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 tablet:space-y-6 overflow-y-auto"
        >
          <div className="card p-4 tablet:p-6">
            <h3 className="text-lg tablet:text-xl font-bold text-gray-900 mb-3 tablet:mb-4">Story Preview</h3>
            
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {storyTitle || 'Untitled Story'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      by {typeof user === 'object' ? user.name : user || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {storyDescription || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{storyData.chapters?.length || 0} chapters</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{storyData.characters?.length || 0} characters</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>New</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFullPreview(true)}
                className="flex-1 btn-secondary text-sm py-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                Full Preview
              </button>
              <button 
                onClick={() => {
                  if (onEdit) {
                    onEdit();
                  } else {
                    onPrevious(); // Fallback to previous step
                  }
                }}
                className="flex-1 btn-accent text-sm py-2"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
            </div>
          </div>

          {/* Story Stats */}
          <div className="card p-4 tablet:p-6">
            <h3 className="text-lg tablet:text-xl font-bold text-gray-900 mb-3 tablet:mb-4">Story Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {storyData.chapters?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {storyData.characters?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {storyData.genre || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">Genre</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {storyData.ageRange?.min}-{storyData.ageRange?.max}
                </div>
                <div className="text-sm text-gray-600">Age Range</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Action Buttons and Navigation - Fixed at bottom */}
      <div className="flex-shrink-0 mt-4 tablet:mt-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 justify-center items-center"
        >
          <button
            onClick={handleSaveDraft}
            className="px-4 tablet:px-6 py-2 tablet:py-3 bg-gray-100 text-gray-700 rounded-lg tablet:rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm tablet:text-base"
          >
            Save as Draft
          </button>
          <button
            onClick={() => {
              setShowFullPreview(true);
              // Wait for the preview to render before printing
              setTimeout(() => {
                window.print();
              }, 500);
            }}
            className="px-4 tablet:px-6 py-2 tablet:py-3 bg-blue-100 text-blue-700 rounded-lg tablet:rounded-xl font-semibold hover:bg-blue-200 transition-colors text-sm tablet:text-base flex items-center"
          >
            <Download className="w-4 h-4 tablet:w-5 tablet:h-5 mr-2" />
            Print Book
          </button>
          <button
            onClick={handlePublish}
            disabled={!storyTitle.trim()}
            className={`px-4 tablet:px-6 py-2 tablet:py-3 rounded-lg tablet:rounded-xl font-semibold transition-all text-sm tablet:text-base flex items-center ${
              !storyTitle.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <Share2 className="w-4 h-4 tablet:w-5 tablet:h-5 mr-2" />
            Publish Story
          </button>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-4 tablet:px-6 py-2 tablet:py-3 rounded-lg tablet:rounded-xl font-semibold text-primary-600 hover:bg-primary-50 transition-colors text-sm tablet:text-base"
          >
            <ArrowRight className="w-4 h-4 tablet:w-5 tablet:h-5 rotate-180" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-xs tablet:text-sm text-gray-500 mb-1">Ready to Publish</div>
            <div className="text-base tablet:text-lg font-bold text-primary-600">
              {storyTitle ? 'Yes!' : 'Almost'}
            </div>
          </div>

          <div className="w-24 tablet:w-32"></div>
        </div>
      </div>
    </div>
  );
}
