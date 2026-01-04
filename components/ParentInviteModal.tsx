'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Check } from 'lucide-react';
import { Story } from '@/types/Story';

interface ParentInviteModalProps {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (parentEmail: string, parentName: string) => void;
}

export default function ParentInviteModal({ story, isOpen, onClose, onInvite }: ParentInviteModalProps) {
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [invitedParents, setInvitedParents] = useState<Array<{ email: string; name: string }>>(
    story.sharedWith?.parentEmails.map((email, idx) => ({
      email,
      name: story.sharedWith?.parentNames[idx] || 'Parent',
    })) || []
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccessfully, setSentSuccessfully] = useState(false);

  const handleAddParent = () => {
    if (parentEmail && parentName) {
      const newParent = { email: parentEmail, name: parentName };
      setInvitedParents(prev => [...prev, newParent]);
      onInvite(parentEmail, parentName);
      setParentEmail('');
      setParentName('');
    }
  };

  const handleSendInvites = async () => {
    setIsSending(true);
    // Simulate sending invites (in real app, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSentSuccessfully(true);
    setIsSending(false);
    
    setTimeout(() => {
      setSentSuccessfully(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card p-6 tablet:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl tablet:text-3xl font-bold text-gray-900">
              Share Story with Parents 👨‍👩‍👧
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="card p-4 bg-gradient-to-r from-primary-50 to-secondary-50 mb-4">
              <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
              <p className="text-sm text-gray-600">{story.description || 'Your amazing story!'}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g., Mom, Dad, Grandma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddParent}
              disabled={!parentEmail || !parentName}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-5 h-5" />
              <span>Add Parent</span>
            </button>
          </div>

          {invitedParents.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Invited Parents</h3>
              <div className="space-y-2">
                {invitedParents.map((parent, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{parent.name}</div>
                      <div className="text-sm text-gray-600">{parent.email}</div>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendInvites}
              disabled={invitedParents.length === 0 || isSending || sentSuccessfully}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {sentSuccessfully ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Sent!</span>
                </>
              ) : isSending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Invites</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Parents will receive an email with a link to read this story
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

