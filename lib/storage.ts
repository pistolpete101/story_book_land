// Story storage utilities - user-specific storage
import { Story } from '@/types/Story';

const STORIES_KEY_PREFIX = 'stories_';
const SHARED_STORIES_KEY_PREFIX = 'shared_stories_';

export function getUserStoriesKey(userId: string): string {
  return `${STORIES_KEY_PREFIX}${userId}`;
}

export function getSharedStoriesKey(userId: string): string {
  return `${SHARED_STORIES_KEY_PREFIX}${userId}`;
}

export function getUserStories(userId: string): Story[] {
  if (typeof window === 'undefined') return [];
  
  const key = getUserStoriesKey(userId);
  console.log('getUserStories: Looking for key', key);
  let stored = localStorage.getItem(key);
  console.log('getUserStories: Found data?', !!stored, stored ? JSON.parse(stored).length + ' stories' : 'none');
  
  // If no stories found with current user ID, check for any story keys (migration)
  if (!stored) {
    console.log('getUserStories: No stories found, checking for any story keys...');
    const allKeys = Object.keys(localStorage);
    const storyKeys = allKeys.filter(k => k.startsWith(STORIES_KEY_PREFIX));
    console.log('getUserStories: Found story keys', storyKeys);
    
    // If we find stories with a different key, migrate them
    if (storyKeys.length > 0) {
      const oldKey = storyKeys[0];
      const oldStories = localStorage.getItem(oldKey);
      if (oldStories) {
        console.log('getUserStories: Migrating stories from', oldKey, 'to', key);
        localStorage.setItem(key, oldStories);
        stored = oldStories;
      }
    }
  }
  
  if (!stored) return [];
  
  try {
    const stories = JSON.parse(stored);
    console.log('getUserStories: Parsed stories', stories.length);
    
    // Enhanced deduplication: by ID and also by title+author if ID is missing
    const storyMap = new Map<string, any>();
    const titleAuthorMap = new Map<string, any>(); // Fallback for stories without IDs
    
    stories.forEach((story: any) => {
      if (story.id) {
        // Primary deduplication by ID
        const existing = storyMap.get(story.id);
        if (!existing) {
          storyMap.set(story.id, story);
        } else {
          // Keep the most recent version
          const existingDate = existing.updatedAt ? new Date(existing.updatedAt) : new Date(0);
          const currentDate = story.updatedAt ? new Date(story.updatedAt) : new Date(0);
          if (currentDate > existingDate) {
            storyMap.set(story.id, story);
          }
        }
      } else {
        // Fallback: deduplicate by title + author for stories without IDs
        const titleAuthorKey = `${story.title || ''}_${story.author || ''}`;
        const existing = titleAuthorMap.get(titleAuthorKey);
        if (!existing) {
          titleAuthorMap.set(titleAuthorKey, story);
        } else {
          const existingDate = existing.updatedAt ? new Date(existing.updatedAt) : new Date(0);
          const currentDate = story.updatedAt ? new Date(story.updatedAt) : new Date(0);
          if (currentDate > existingDate) {
            titleAuthorMap.set(titleAuthorKey, story);
          }
        }
      }
    });
    
    // Combine both maps, prioritizing ID-based stories
    const uniqueStories = Array.from(storyMap.values());
    titleAuthorMap.forEach((story) => {
      // Only add if not already in uniqueStories (by title+author check)
      const exists = uniqueStories.some(s => 
        s.title === story.title && s.author === story.author
      );
      if (!exists) {
        uniqueStories.push(story);
      }
    });
    
    console.log('getUserStories: After deduplication', uniqueStories.length);
    
    // Sort by updatedAt descending (most recent first)
    uniqueStories.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    // Convert date strings back to Date objects
    return uniqueStories.map((story: any) => ({
      ...story,
      createdAt: story.createdAt ? new Date(story.createdAt) : new Date(),
      updatedAt: story.updatedAt ? new Date(story.updatedAt) : new Date(),
      publishedAt: story.publishedAt ? new Date(story.publishedAt) : undefined,
    }));
  } catch (error) {
    console.error('getUserStories: Error parsing stories', error);
    return [];
  }
}

export function saveUserStory(userId: string, story: Story): void {
  if (typeof window === 'undefined') return;
  
  console.log('saveUserStory: Saving story', { userId, storyId: story.id, title: story.title });
  const stories = getUserStories(userId);
  
  // Ensure story has an ID
  if (!story.id) {
    console.warn('saveUserStory: Story missing ID, generating one');
    story.id = Math.random().toString(36).substr(2, 9);
  }
  
  // Find existing story by ID
  const existingIndex = stories.findIndex(s => s.id === story.id);
  
  if (existingIndex >= 0) {
    // Update existing story, preserving createdAt if it exists
    const existingStory = stories[existingIndex];
    stories[existingIndex] = {
      ...story,
      createdAt: story.createdAt || existingStory.createdAt || new Date(),
      updatedAt: new Date(), // Always update the updatedAt timestamp
    };
    console.log('saveUserStory: Updated existing story');
  } else {
    // Add new story with timestamps
    stories.push({
      ...story,
      createdAt: story.createdAt || new Date(),
      updatedAt: story.updatedAt || new Date(),
    });
    console.log('saveUserStory: Added new story, total:', stories.length);
  }
  
  // Save back to localStorage with deduplication
  const key = getUserStoriesKey(userId);
  
  // Final deduplication pass before saving
  const storyMap = new Map<string, Story>();
  stories.forEach((s: Story) => {
    if (s.id) {
      const existing = storyMap.get(s.id);
      if (!existing || new Date(s.updatedAt) > new Date(existing.updatedAt)) {
        storyMap.set(s.id, s);
      }
    }
  });
  
  const deduplicatedStories = Array.from(storyMap.values());
  localStorage.setItem(key, JSON.stringify(deduplicatedStories));
  console.log('saveUserStory: Saved to localStorage key', key, 'with', deduplicatedStories.length, 'stories');
}

export function deleteUserStory(userId: string, storyId: string): void {
  if (typeof window === 'undefined') return;
  
  console.log('deleteUserStory: Deleting story', { userId, storyId });
  const stories = getUserStories(userId);
  console.log('deleteUserStory: Current stories count', stories.length);
  const filtered = stories.filter(s => s.id !== storyId);
  console.log('deleteUserStory: After filter, stories count', filtered.length);
  const key = getUserStoriesKey(userId);
  localStorage.setItem(key, JSON.stringify(filtered));
  console.log('deleteUserStory: Saved to localStorage');
}

// Shared stories (stories shared with parents)
export function getSharedStories(userId: string): Story[] {
  if (typeof window === 'undefined') return [];
  
  const key = getSharedStoriesKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addSharedStory(userId: string, story: Story): void {
  if (typeof window === 'undefined') return;
  
  const shared = getSharedStories(userId);
  if (!shared.find(s => s.id === story.id)) {
    shared.push(story);
    const key = getSharedStoriesKey(userId);
    localStorage.setItem(key, JSON.stringify(shared));
  }
}

// Story draft storage - for saving work in progress
const DRAFT_KEY_PREFIX = 'story_draft_';

export function getStoryDraftKey(userId: string): string {
  return `${DRAFT_KEY_PREFIX}${userId}`;
}

export function saveStoryDraft(userId: string, draftData: any): void {
  if (typeof window === 'undefined') return;
  
  const key = getStoryDraftKey(userId);
  localStorage.setItem(key, JSON.stringify(draftData));
}

export function getStoryDraft(userId: string): any | null {
  if (typeof window === 'undefined') return null;
  
  const key = getStoryDraftKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearStoryDraft(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const key = getStoryDraftKey(userId);
  localStorage.removeItem(key);
}

