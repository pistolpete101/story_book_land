'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tablet, Monitor, Smartphone } from 'lucide-react';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      // Consider mobile if width is less than 768px (tablet breakpoint)
      const mobile = width < 768;
      setIsMobile(mobile);
      setIsVisible(mobile);
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Smartphone className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Mobile Device Detected</h3>
                  <p className="text-sm opacity-90">
                    Story Book Land is optimized for tablets and desktops. For the best experience, please use an iPad or desktop computer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

