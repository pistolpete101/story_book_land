'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Star,
  Heart,
  Share2,
  Download,
  Image as ImageIcon,
  Trash2
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
}

export default function BookReadingView({ book, onBack, onDelete }: BookReadingViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState('medium');
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(book.rating || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use the actual book data passed to the component
  const pages = (book as any).chapters || (book as any).pages || [];
  const hasVoiceRecording = (book as any).voiceRecordings && (book as any).voiceRecordings.length > 0;

  const currentPageData = pages[currentPage - 1];

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out this story: ${book.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
        const reader = new FileReader();
        reader.onload = (event: any) => {
          // Handle image upload - for now just log it
          console.log('Image selected:', event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePrint = () => {
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

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${book.title}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 1.5cm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            .page {
              page-break-after: always;
              break-after: page;
              padding: 1.5cm;
              min-height: calc(100vh - 3cm);
              box-sizing: border-box;
              background: white;
            }
            .page:last-child {
              page-break-after: auto;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: black;
            }
            h2 {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
              color: black;
            }
            .content {
              font-size: 1rem;
              line-height: 1.6;
              white-space: pre-wrap;
              color: black;
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
          ${allPages.map((page: any, index: number) => {
            if (page.isCover) {
              return `
                <div class="page cover-page">
                  <h1 class="cover-title">${page.title || 'Untitled Story'}</h1>
                  <p class="cover-author">by ${page.author}</p>
                  ${page.description ? `<p class="cover-description">${page.description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
                  ${page.genre ? `<p class="cover-genre">Genre: ${page.genre}</p>` : ''}
                </div>
              `;
            } else if (page.isTOC) {
              return `
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
              `;
            } else {
              // Escape HTML and preserve line breaks
              const escapedContent = (page.content || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\n/g, '<br>');
              
              // Build settings display
              const settingsHtml = page.settings && (page.settings.location || page.settings.timeOfDay || page.settings.weather) 
                ? `<div class="chapter-settings">
                    ${page.settings.location ? `<span class="setting-tag">📍 ${page.settings.location}</span>` : ''}
                    ${page.settings.timeOfDay ? `<span class="setting-tag">⏰ ${page.settings.timeOfDay}</span>` : ''}
                    ${page.settings.weather ? `<span class="setting-tag">🌤️ ${page.settings.weather}</span>` : ''}
                  </div>`
                : '';
              
              return `
                <div class="page">
                  <h2>Chapter ${page.chapterNumber || index}: ${page.title || 'Untitled'}</h2>
                  <div class="content">${escapedContent}</div>
                  ${settingsHtml}
                </div>
              `;
            }
          }).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait a bit for content to render, then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
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
                className="p-2 hover:bg-amber-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">by {book.author || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-amber-100 rounded-full transition-colors"
                title="Print"
              >
                <Download className="w-5 h-5" />
              </button>
              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500"
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
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentPageData.content}
                  </div>
                </div>

                {/* Add Image Button - hidden in print */}
                <div className="mt-6 pt-4 border-t border-amber-200 no-print">
                  <button
                    onClick={handleAddImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Add Image</span>
                  </button>
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
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-amber-100 hover:bg-amber-200 text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 bg-amber-100 hover:bg-amber-200 text-gray-600 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`transition-colors ${
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
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
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
                className={`w-3 h-3 rounded-full transition-all ${
                  index + 1 === currentPage ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
