'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveUserStory, getUserStories } from '@/lib/storage';
import { 
  ArrowLeft, 
  ArrowRight, 
  Star,
  Heart,
  Printer,
  Download,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
  readingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
  progress: number;
  rating: number;
  lastRead: string;
  pages: number;
}

interface BookReadingViewProps {
  book: Book;
  onBack: () => void;
  onDelete?: (bookId: string) => void;
  user?: { id: string; name: string };
}

export default function BookReadingView({ book, onBack, onDelete, user }: BookReadingViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState('medium');
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(book.rating || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [localPages, setLocalPages] = useState<any[]>([]);

  // Use the actual book data passed to the component
  const pages = localPages.length > 0 ? localPages : ((book as any).chapters || (book as any).pages || []);
  const hasVoiceRecording = (book as any).voiceRecordings && (book as any).voiceRecordings.length > 0;

  // Initialize local pages on mount
  useEffect(() => {
    const initialPages = (book as any).chapters || (book as any).pages || [];
    setLocalPages(initialPages);
  }, [book]);

  const currentPageData = pages[currentPage - 1];

  // Initialize edited content when entering edit mode
  useEffect(() => {
    if (isEditing && currentPageData) {
      setEditedContent(currentPageData.content || '');
      setEditedImage(currentPageData.image || null);
    }
  }, [isEditing, currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };


  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleFinished = () => {
    // Navigate back to main page
    onBack();
  };

  const handleAddImage = () => {
    // Create file input for adding images
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (isEditing) {
            setEditedImage(event.target.result as string);
          } else {
            // Handle image upload for non-edit mode
            console.log('Image selected:', event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSaveEdit = () => {
    if (!currentPageData) return;

    const updatedPages = [...localPages];
    const pageIndex = currentPage - 1;
    
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      content: editedContent,
      image: editedImage || updatedPages[pageIndex].image,
    };

    setLocalPages(updatedPages);

    // Save to storage
    const userId = user?.id || 'test-user-123'; // Use provided user ID or fallback
    const allStories = getUserStories(userId);
    const storyIndex = allStories.findIndex((s: any) => s.id === book.id);
    
    if (storyIndex >= 0) {
      const updatedStory = {
        ...allStories[storyIndex],
        chapters: updatedPages,
        updatedAt: new Date(),
      };
      allStories[storyIndex] = updatedStory;
      
      // Save back to storage
      const key = `stories_${userId}`;
      localStorage.setItem(key, JSON.stringify(allStories));
      
      setIsEditing(false);
      // Update the book object
      (book as any).chapters = updatedPages;
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
    setEditedImage(null);
  };

  const handlePrint = () => {
    try {
      // Generate all pages including cover, TOC, and chapters
      const allPages: any[] = [];
      let currentPageNum = 1;
      
      // Add Cover/Title Page
      allPages.push({
        id: 'cover',
        pageNumber: currentPageNum++,
        title: book.title,
        isCover: true,
        author: book.author || 'Unknown',
        description: (book as any).description || '',
        genre: book.genre || '',
      });
      
      // Add Table of Contents if there are chapters
      if (pages.length > 0) {
        allPages.push({
          id: 'toc',
          pageNumber: currentPageNum++,
          title: 'Table of Contents',
          isTOC: true,
          chapters: pages.map((chapter: any, index: number) => ({
            ...chapter,
            pageNumber: currentPageNum + index, // Chapters start after TOC
            image: chapter.image, // Include image in TOC data
          })),
        });
      }
      
      // Add all chapters with their settings
      pages.forEach((chapter: any, index: number) => {
        allPages.push({
          id: chapter.id,
          pageNumber: currentPageNum++,
          title: chapter.title,
          content: chapter.content,
          chapterNumber: chapter.chapterNumber || index + 1,
          image: chapter.image,
          layout: chapter.layout || 'image-text',
          settings: chapter.settings || {},
          characters: chapter.characters || [],
        });
      });

      // Create a print-friendly version with all pages
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        // Fallback to regular print if popup blocked
        window.print();
        return;
      }

      // Add error handler for print window
      printWindow.onerror = (error) => {
        console.error('Print window error:', error);
        printWindow.close();
      };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${book.title}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 1cm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            .print-spread {
              page-break-after: always;
              break-after: page;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1cm;
              padding: 1cm;
              min-height: calc(100vh - 2cm);
              box-sizing: border-box;
            }
            .print-spread:last-child {
              page-break-after: auto;
            }
            .print-spread[style*="grid-template-columns: 1fr"] {
              grid-template-columns: 1fr !important;
            }
            .page {
              padding: 0.8cm;
              box-sizing: border-box;
              background: white;
              border: 1px solid #e5e7eb;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: black;
            }
            h2 {
              font-size: 1rem;
              margin-bottom: 0.4rem;
              font-weight: bold;
              color: black;
            }
            .content {
              font-size: 0.85rem;
              line-height: 1.4;
              white-space: pre-wrap;
              color: black;
              flex: 1;
            }
            .toc-item {
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 0;
              border-bottom: 1px solid #ddd;
            }
            .toc-item:last-child {
              border-bottom: none;
            }
            .cover-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            .cover-title {
              font-size: 3rem;
              margin-bottom: 1rem;
              color: black;
            }
            .cover-author {
              font-size: 1.5rem;
              margin-bottom: 2rem;
              color: #555;
            }
            .cover-description {
              font-size: 1.1rem;
              line-height: 1.8;
              max-width: 600px;
              margin: 0 auto;
              color: #333;
            }
            .cover-genre {
              font-size: 1rem;
              margin-top: 2rem;
              color: #666;
            }
            .chapter-settings {
              margin-top: 1rem;
              padding-top: 1rem;
              border-top: 1px solid #ddd;
              font-size: 0.9rem;
              color: #555;
            }
            .setting-tag {
              display: inline-block;
              margin-right: 0.5rem;
              margin-bottom: 0.5rem;
              padding: 0.25rem 0.75rem;
              background: #f0f0f0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          ${(() => {
            // Group pages into spreads (2 pages per physical page)
            const spreads: any[][] = [];
            let currentSpread: any[] = [];
            
            allPages.forEach((page: any, index: number) => {
              // Cover and TOC get full width
              if (page.isCover || page.isTOC) {
                if (currentSpread.length > 0) {
                  spreads.push(currentSpread);
                  currentSpread = [];
                }
                spreads.push([page]); // Full width for cover/TOC
              } else {
                currentSpread.push(page);
                if (currentSpread.length === 2) {
                  spreads.push(currentSpread);
                  currentSpread = [];
                }
              }
            });
            
            // Add remaining page if odd number
            if (currentSpread.length > 0) {
              spreads.push(currentSpread);
            }
            
            return spreads.map((spread: any[], spreadIndex: number) => {
              // Cover and TOC get full page
              if (spread.length === 1 && (spread[0].isCover || spread[0].isTOC)) {
                const page = spread[0];
                if (page.isCover) {
                  return `
                    <div class="print-spread" style="grid-template-columns: 1fr;">
                      <div class="page cover-page">
                        <h1 class="cover-title">${page.title || 'Untitled Story'}</h1>
                        <p class="cover-author">by ${page.author}</p>
                        ${page.description ? `<p class="cover-description">${page.description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
                        ${page.genre ? `<p class="cover-genre">Genre: ${page.genre}</p>` : ''}
                      </div>
                    </div>
                  `;
                } else if (page.isTOC) {
                  return `
                    <div class="print-spread" style="grid-template-columns: 1fr;">
                      <div class="page">
                        <h1>Table of Contents</h1>
                        <div style="margin-top: 2rem;">
                          ${page.chapters.map((chapter: any, idx: number) => `
                            <div class="toc-item">
                              <span>Chapter ${chapter.chapterNumber || idx + 1}: ${chapter.title || 'Untitled'}</span>
                              <span>Page ${chapter.pageNumber || idx + 2}</span>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                  `;
                }
              }
              
              // Regular pages - 2 per spread
              return `
                <div class="print-spread">
                  ${spread.map((page: any) => {
                    if (!page) return '<div class="page"></div>';
                    
                    const escapedContent = (page.content || '')
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#39;')
                      .replace(/\n/g, '<br>');
                    
                    const settingsHtml = page.settings && (page.settings.location || page.settings.timeOfDay || page.settings.weather) 
                      ? `<div class="chapter-settings">
                          ${page.settings.location ? `<span class="setting-tag">📍 ${page.settings.location}</span>` : ''}
                          ${page.settings.timeOfDay ? `<span class="setting-tag">⏰ ${page.settings.timeOfDay}</span>` : ''}
                          ${page.settings.weather ? `<span class="setting-tag">🌤️ ${page.settings.weather}</span>` : ''}
                        </div>`
                      : '';
                    
                    let imageHtml = '';
                    if (page.image) {
                      const layout = page.layout || 'image-text';
                      if (layout === 'image-text') {
                        imageHtml = `<img src="${page.image}" alt="${page.title || 'Chapter'}" style="max-width: 100%; max-height: 120px; object-fit: contain; margin-bottom: 0.4rem;" />`;
                      } else if (layout === 'text-image') {
                        imageHtml = `<img src="${page.image}" alt="${page.title || 'Chapter'}" style="max-width: 100%; max-height: 120px; object-fit: contain; margin-top: 0.4rem;" />`;
                      }
                    }
                    
                    const contentHtml = `<div class="content">${escapedContent}</div>`;
                    
                    return `
                      <div class="page">
                        <h2>Chapter ${page.chapterNumber || ''}: ${page.title || 'Untitled'}</h2>
                        ${page.layout === 'image-text' && page.image ? imageHtml + contentHtml : ''}
                        ${page.layout === 'text-image' && page.image ? contentHtml + imageHtml : ''}
                        ${!page.image ? contentHtml : ''}
                        ${settingsHtml}
                      </div>
                    `;
                  }).join('')}
                </div>
              `;
            }).join('');
          })()}
        </body>
      </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait a bit for content to render, then print
      setTimeout(() => {
        try {
          printWindow.print();
          // Don't auto-close the window - let user close it manually after printing
          // This prevents the app from crashing
        } catch (error) {
          console.error('Print error:', error);
          // If print fails, close the window
          if (printWindow && !printWindow.closed) {
            printWindow.close();
          }
        }
      }, 500);
    } catch (error) {
      console.error('Print function error:', error);
      alert('Failed to open print dialog. Please try again.');
    }
  };

  const progressPercentage = pages.length > 0 ? (currentPage / pages.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-amber-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">by {book.author || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-amber-100 rounded-full transition-colors flex items-center justify-center"
                  title="Edit inline"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 hover:bg-green-100 rounded-full transition-colors text-green-600 flex items-center justify-center"
                    title="Save changes"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex items-center justify-center"
                    title="Cancel editing"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-amber-100 rounded-full transition-colors flex items-center justify-center"
                title="Print"
              >
                <Printer className="w-5 h-5" />
              </button>
              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500 flex items-center justify-center"
                  title="Delete story"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Chapter {currentPage} of {pages.length}</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-amber-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Story?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDelete) {
                    onDelete(book.id);
                  }
                  onBack();
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reading Area */}
      <div className="max-w-4xl mx-auto px-4 py-8 print-reading-area">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 md:p-12 border-2 border-amber-200 shadow-lg print-page"
        >
          <div className={`${fontSize === 'small' ? 'text-base' : fontSize === 'large' ? 'text-xl' : 'text-lg'} leading-relaxed`}>
            {currentPageData && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Chapter {currentPageData.chapterNumber || currentPage}: {currentPageData.title}
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {isEditing ? (
                    <>
                      {/* Edit Mode */}
                      {((editedImage || currentPageData.image) && currentPageData.layout === 'image-text') && (
                        <div className="mb-6 relative">
                          <img
                            src={editedImage || currentPageData.image}
                            alt={currentPageData.title}
                            className="w-full rounded-lg shadow-md object-cover"
                            style={{ maxHeight: '400px' }}
                          />
                          <button
                            onClick={handleAddImage}
                            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors flex items-center justify-center"
                            title="Change image"
                          >
                            <ImageIcon className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      )}
                      
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 leading-relaxed resize-y min-h-[200px]"
                        placeholder="Enter chapter content..."
                      />
                      
                      {((editedImage || currentPageData.image) && currentPageData.layout === 'text-image') && (
                        <div className="mt-6 relative">
                          <img
                            src={editedImage || currentPageData.image}
                            alt={currentPageData.title}
                            className="w-full rounded-lg shadow-md object-cover"
                            style={{ maxHeight: '400px' }}
                          />
                          <button
                            onClick={handleAddImage}
                            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors flex items-center justify-center"
                            title="Change image"
                          >
                            <ImageIcon className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      )}
                      
                      {!currentPageData.image && !editedImage && (
                        <button
                          onClick={handleAddImage}
                          className="w-full mb-6 p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-400 transition-colors flex items-center justify-center space-x-2 text-amber-700"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span>Add Image</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      {currentPageData.image ? (
                        <>
                          {/* Image + Text Layout: Image above text */}
                          {currentPageData.layout === 'image-text' && (
                            <>
                              <div className="mb-6">
                                <img
                                  src={currentPageData.image}
                                  alt={currentPageData.title}
                                  className="w-full rounded-lg shadow-md object-cover"
                                  style={{ maxHeight: '400px' }}
                                />
                              </div>
                              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {currentPageData.content}
                              </div>
                            </>
                          )}
                          
                          {/* Text + Image Layout: Text above image */}
                          {currentPageData.layout === 'text-image' && (
                            <>
                              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-6">
                                {currentPageData.content}
                              </div>
                              <div className="mb-6">
                                <img
                                  src={currentPageData.image}
                                  alt={currentPageData.title}
                                  className="w-full rounded-lg shadow-md object-cover"
                                  style={{ maxHeight: '400px' }}
                                />
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        /* No image - just text */
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {currentPageData.content}
                        </div>
                      )}
                    </>
                  )}
                </div>

              </>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 no-print print-hide">
          {currentPage > 1 ? (
            <button
              onClick={handlePreviousPage}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all bg-amber-100 hover:bg-amber-200 text-amber-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                isFavorite 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-amber-100 hover:bg-amber-200 text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 bg-amber-100 hover:bg-amber-200 text-gray-600 rounded-full transition-colors flex items-center justify-center"
              title="Print story"
            >
              <Printer className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`transition-colors flex items-center justify-center ${
                    star <= rating ? 'text-amber-500' : 'text-gray-300'
                  }`}
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={currentPage === pages.length ? handleFinished : handleNextPage}
            className="hidden sm:flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
          >
            <span>{currentPage === pages.length ? 'Finished!' : 'Next'}</span>
            {currentPage < pages.length && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-8 print-hide">
          <div className="flex space-x-2">
            {pages.map((_: unknown, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer hover:scale-125 min-w-[12px] min-h-[12px] touch-manipulation ${
                  index + 1 === currentPage ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
