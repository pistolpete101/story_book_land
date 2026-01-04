'use client';

import { useState, useEffect } from 'react';
import { Tablet, Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeviceRecommendation() {
  const [isVisible, setIsVisible] = useState(true);

  // Only show on tablet/desktop (not mobile)
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      // Hide on mobile devices
      if (width < 768) {
        setIsVisible(false);
      }
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card p-1 tablet:p-1.5 mb-0.5 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 relative flex-shrink-0"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex flex-col tablet:flex-row items-center tablet:items-start gap-3 tablet:gap-4 pr-8">
            <div className="flex items-center space-x-2 tablet:space-x-3">
              <div className="w-10 h-10 tablet:w-12 tablet:h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <Tablet className="w-5 h-5 tablet:w-6 tablet:h-6 text-white" />
              </div>
              <div className="w-10 h-10 tablet:w-12 tablet:h-12 rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 flex items-center justify-center">
                <Monitor className="w-5 h-5 tablet:w-6 tablet:h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center tablet:text-left">
              <h3 className="text-sm tablet:text-base font-bold text-gray-900 mb-0">
                Optimized for Tablets & Desktops
              </h3>
              <p className="text-xs tablet:text-xs text-gray-700 line-clamp-2">
                Story Book Land is designed to work best on tablets (like iPad) and desktop computers. 
                The larger screen provides the perfect canvas for creating and reading magical stories!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

