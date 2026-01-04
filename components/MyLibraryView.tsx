'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/User';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  BookOpen, 
  PenTool, 
  Star,
  Clock,
  Eye,
  Heart,
  Users,
  Share2,
  Trash2
} from 'lucide-react';
import { getUserStories, saveUserStory, deleteUserStory } from '@/lib/storage';
import BookReadingView from './BookReadingView';
import ParentInviteModal from './ParentInviteModal';

// Genre style mapping
const getGenreStyle = (genre: string) => {
  const genreLower = genre?.toLowerCase() || '';
  const styles: Record<string, { gradient: string; border: string; badge: string; text: string }> = {
    'adventure': {
      gradient: 'from-blue-200 to-blue-400',
      border: 'border-blue-300',
      badge: 'bg-blue-500/90',
      text: 'text-blue-900',
    },
    'fantasy': {
      gradient: 'from-purple-200 to-purple-400',
      border: 'border-purple-300',
      badge: 'bg-purple-500/90',
      text: 'text-purple-900',
    },
    'magic': {
      gradient: 'from-indigo-200 to-indigo-400',
      border: 'border-indigo-300',
      badge: 'bg-indigo-500/90',
      text: 'text-indigo-900',
    },
    'mystery': {
      gradient: 'from-gray-200 to-gray-400',
      border: 'border-gray-300',
      badge: 'bg-gray-500/90',
      text: 'text-gray-900',
    },
    'science-fiction': {
      gradient: 'from-cyan-200 to-cyan-400',
      border: 'border-cyan-300',
      badge: 'bg-cyan-500/90',
      text: 'text-cyan-900',
    },
    'fairy-tale': {
      gradient: 'from-pink-200 to-pink-400',
      border: 'border-pink-300',
      badge: 'bg-pink-500/90',
      text: 'text-pink-900',
    },
    'animal': {
      gradient: 'from-green-200 to-green-400',
      border: 'border-green-300',
      badge: 'bg-green-500/90',
      text: 'text-green-900',
    },
    'friendship': {
      gradient: 'from-yellow-200 to-yellow-400',
      border: 'border-yellow-300',
      badge: 'bg-yellow-500/90',
      text: 'text-yellow-900',
    },
  };
  
  return styles[genreLower] || {
    gradient: 'from-amber-200 to-orange-300',
    border: 'border-amber-300',
    badge: 'bg-amber-500/90',
    text: 'text-amber-900',
  };
};

interface MyLibraryViewProps {
  user: User;
  onBack: () => void;
  publishedStories?: any[];
  onEditStory?: (story: any) => void;
  initialBookId?: string | null;
  onBookOpened?: () => void;
}

export default function MyLibraryView({ user, onBack, publishedStories = [], onEditStory, initialBookId, onBookOpened }: MyLibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState<string | null>(initialBookId || null);
  const [books, setBooks] = useState<any[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedStoryForInvite, setSelectedStoryForInvite] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load user's stories from storage
  useEffect(() => {
    if (!user || !user.id) return;
    
    const userStories = getUserStories(user.id);
    if (userStories && userStories.length > 0) {
      setBooks(userStories);
    } else if (publishedStories && publishedStories.length > 0) {
      setBooks(publishedStories);
    } else {
      setBooks([]);
    }
  }, [user?.id, publishedStories]);

  const handleInviteParent = (story: any) => {
    setSelectedStoryForInvite(story);
    setInviteModalOpen(true);
  };

  const handleInvite = (parentEmail: string, parentName: string) => {
    if (!selectedStoryForInvite) return;

    const updatedStory = {
      ...selectedStoryForInvite,
      sharedWith: {
        parentEmails: [
          ...(selectedStoryForInvite.sharedWith?.parentEmails || []),
          parentEmail,
        ],
        parentNames: [
          ...(selectedStoryForInvite.sharedWith?.parentNames || []),
          parentName,
        ],
      },
      isShared: true,
    };

    // Save updated story
    saveUserStory(user.id, updatedStory);
    
    // Update local state
    setBooks(prev => prev.map(b => b.id === updatedStory.id ? updatedStory : b));
  };

  const handleDeleteStory = (bookId: string) => {
    if (deleteConfirm === bookId) {
      // Confirm deletion
      deleteUserStory(user.id, bookId);
      setBooks(prev => prev.filter(b => b.id !== bookId));
      setDeleteConfirm(null);
      // If the deleted book was being viewed, go back
      if (selectedBook === bookId) {
        setSelectedBook(null);
      }
    } else {
      // Show confirmation
      setDeleteConfirm(bookId);
      // Auto-cancel after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const filters = [
    { id: 'all', label: 'All Books', count: books.length },
    { id: 'reading', label: 'Currently Reading', count: books.filter(b => b.progress > 0 && b.progress < 100).length },
    { id: 'completed', label: 'Completed', count: books.filter(b => b.progress === 100).length },
    { id: 'unread', label: 'Not Started', count: books.filter(b => b.progress === 0).length },
    { id: 'drafts', label: 'My Drafts', count: books.filter(b => !b.isPublished).length },
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedFilter) {
      case 'reading':
        return matchesSearch && book.progress > 0 && book.progress < 100;
      case 'completed':
        return matchesSearch && book.progress === 100;
      case 'unread':
        return matchesSearch && book.progress === 0;
      case 'drafts':
        return matchesSearch && !book.isPublished;
      default:
        return matchesSearch;
    }
  });

  // Handle initialBookId prop - set selectedBook immediately if provided
  useEffect(() => {
    if (initialBookId) {
      setSelectedBook(initialBookId);
      if (onBookOpened) {
        onBookOpened();
      }
    }
  }, [initialBookId, onBookOpened]);

  // Listen for openBook event from dashboard (fallback for other navigation methods)
  useEffect(() => {
    const handleOpenBook = (event: CustomEvent) => {
      const bookId = event.detail?.bookId;
      if (bookId) {
        setSelectedBook(bookId);
      }
    };
    window.addEventListener('openBook', handleOpenBook as EventListener);
    return () => window.removeEventListener('openBook', handleOpenBook as EventListener);
  }, []);

  if (selectedBook) {
    const book = books.find(b => b.id === selectedBook);
    if (book) {
      return (
        <BookReadingView
          user={user} 
          book={book} 
          onBack={() => setSelectedBook(null)}
          onDelete={(bookId) => {
            deleteUserStory(user.id, bookId);
            setBooks(prev => prev.filter(b => b.id !== bookId));
            setSelectedBook(null);
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen pt-4 sm:pt-6 tablet:pt-8 px-4 md:px-8 pb-4 md:pb-8" data-library-view>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gradient">My Library</h1>
                <p className="text-xl text-gray-600">Your personal collection of amazing stories</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Books</div>
                <div className="text-2xl font-bold text-primary-600">{books.length}</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                📚
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all flex-shrink-0 text-sm min-w-fit ${
                    selectedFilter === filter.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`card overflow-hidden cursor-pointer border-2 ${getGenreStyle(book.genre).border} transition-colors hover:shadow-lg`}
              style={{
                borderColor: getGenreStyle(book.genre).border.includes('blue') ? '#93c5fd' :
                             getGenreStyle(book.genre).border.includes('purple') ? '#c4b5fd' :
                             getGenreStyle(book.genre).border.includes('indigo') ? '#a5b4fc' :
                             getGenreStyle(book.genre).border.includes('gray') ? '#d1d5db' :
                             getGenreStyle(book.genre).border.includes('cyan') ? '#67e8f9' :
                             getGenreStyle(book.genre).border.includes('pink') ? '#f9a8d4' :
                             getGenreStyle(book.genre).border.includes('green') ? '#86efac' :
                             getGenreStyle(book.genre).border.includes('yellow') ? '#fde047' :
                             '#fcd34d',
              }}
              onClick={() => setSelectedBook(book.id)}
            >
              <div className="relative">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      // Hide broken image and show placeholder div
                      (e.target as HTMLImageElement).style.display = 'none';
                      const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-64 bg-gradient-to-br ${getGenreStyle(book.genre).gradient} flex items-center justify-center px-4 ${book.coverImage ? 'hidden' : ''}`}
                  style={{ display: book.coverImage ? 'none' : 'flex' }}
                >
                  <div className={`text-base font-bold ${getGenreStyle(book.genre).text} text-center line-clamp-3 w-full flex items-center justify-center`}>
                    {book.title || 'Untitled Story'}
                  </div>
                </div>
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  <div className={`${getGenreStyle(book.genre).badge} backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap`}>
                    {book.genre}
                  </div>
                  {book.difficulty && (
                    <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 whitespace-nowrap">
                      {book.difficulty}
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInviteParent(book);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors flex-shrink-0 flex items-center justify-center"
                    title="Share with parents"
                  >
                    <Share2 className="w-4 h-4 text-primary-600" />
                  </button>
                  {book.isPublished ? (
                    <div className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Published
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Draft
                    </div>
                  )}
                </div>
                {book.isShared && (
                  <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Shared</span>
                  </div>
                )}
                {book.progress > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">{book.progress}% complete</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {typeof book.author === 'object' ? book.author?.name || 'Unknown' : book.author || 'Unknown'}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{book.readingTime}m</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{book.pages} pages</span>
                  <span>{book.lastRead}</span>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  {!book.isPublished ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditStory) {
                          onEditStory(book);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                    >
                      Edit Story
                    </button>
                  ) : (
                    <button 
                      onClick={() => setSelectedBook(book.id)}
                      className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                    >
                      {book.progress === 0 ? 'Start Reading' : book.progress === 100 ? 'Read Again' : 'Continue'}
                    </button>
                  )}
                  {book.isPublished && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditStory) {
                          onEditStory(book);
                        }
                      }}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStory(book.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === book.id
                        ? 'bg-red-500 text-white'
                        : 'hover:bg-red-100 text-red-500'
                    }`}
                    title={deleteConfirm === book.id ? 'Click again to confirm' : 'Delete story'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No books match your current filter'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Parent Invite Modal */}
      {selectedStoryForInvite && (
        <ParentInviteModal
          story={selectedStoryForInvite}
          isOpen={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false);
            setSelectedStoryForInvite(null);
          }}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}
