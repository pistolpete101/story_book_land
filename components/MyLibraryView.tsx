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
  Share2
} from 'lucide-react';
import { getUserStories, saveUserStory } from '@/lib/storage';
import BookReadingView from './BookReadingView';
import ParentInviteModal from './ParentInviteModal';

interface MyLibraryViewProps {
  user: User;
  onBack: () => void;
  publishedStories?: any[];
}

export default function MyLibraryView({ user, onBack, publishedStories = [] }: MyLibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedStoryForInvite, setSelectedStoryForInvite] = useState<any>(null);

  // Load user's stories from storage
  useEffect(() => {
    const userStories = getUserStories(user.id);
    if (userStories.length > 0) {
      setBooks(userStories);
    } else if (publishedStories.length > 0) {
      setBooks(publishedStories);
    }
  }, [user.id, publishedStories]);

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

  if (selectedBook) {
    const book = books.find(b => b.id === selectedBook);
    if (book) {
      return <BookReadingView book={book} onBack={() => setSelectedBook(null)} />;
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            <div className="flex space-x-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
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
              className="card overflow-hidden"
            >
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSelectedBook(book.id)}
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {book.genre}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInviteParent(book);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  title="Share with parents"
                >
                  <Share2 className="w-4 h-4 text-primary-600" />
                </button>
                {book.isShared && (
                  <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Shared</span>
                  </div>
                )}
                <div className="absolute top-2 left-12 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {book.difficulty || book.genre}
                </div>
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
                {!book.isPublished && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Draft
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
                  <button className="flex-1 btn-primary text-sm py-2">
                    {book.progress === 0 ? 'Start Reading' : book.progress === 100 ? 'Read Again' : 'Continue'}
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Heart className="w-4 h-4" />
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
