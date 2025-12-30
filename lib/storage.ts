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
    // Convert date strings back to Date objects
    return stories.map((story: any) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
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
  const existingIndex = stories.findIndex(s => s.id === story.id);
  
  if (existingIndex >= 0) {
    stories[existingIndex] = story;
    console.log('saveUserStory: Updated existing story');
  } else {
    stories.push(story);
    console.log('saveUserStory: Added new story, total:', stories.length);
  }
  
  const key = getUserStoriesKey(userId);
  localStorage.setItem(key, JSON.stringify(stories));
  console.log('saveUserStory: Saved to localStorage key', key, 'with', stories.length, 'stories');
}

export function deleteUserStory(userId: string, storyId: string): void {
  if (typeof window === 'undefined') return;
  
  const stories = getUserStories(userId);
  const filtered = stories.filter(s => s.id !== storyId);
  const key = getUserStoriesKey(userId);
  localStorage.setItem(key, JSON.stringify(filtered));
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

