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
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  try {
    const stories = JSON.parse(stored);
    // Convert date strings back to Date objects
    return stories.map((story: any) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
      publishedAt: story.publishedAt ? new Date(story.publishedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

export function saveUserStory(userId: string, story: Story): void {
  if (typeof window === 'undefined') return;
  
  const stories = getUserStories(userId);
  const existingIndex = stories.findIndex(s => s.id === story.id);
  
  if (existingIndex >= 0) {
    stories[existingIndex] = story;
  } else {
    stories.push(story);
  }
  
  const key = getUserStoriesKey(userId);
  localStorage.setItem(key, JSON.stringify(stories));
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

