// Database utilities for storing stories
// Using localStorage as fallback, but ready for Supabase integration

import { Story } from '@/types/Story';
import { getUserStories, saveUserStory } from './storage';

// For now, we'll use localStorage (already implemented)
// When ready to use Supabase, uncomment and configure:

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getUserStoriesFromDB(userId: string): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stories:', error);
    return [];
  }

  return data || [];
}

export async function saveStoryToDB(story: Story, userId: string): Promise<void> {
  const { error } = await supabase
    .from('stories')
    .upsert({
      id: story.id,
      user_id: userId,
      title: story.title,
      description: story.description,
      genre: story.genre,
      cover_image: story.coverImage,
      pages: story.pages,
      characters: story.characters,
      settings: story.settings,
      status: story.status,
      author: typeof story.author === 'object' ? story.author.name : story.author,
      shared_with: story.sharedWith,
      created_at: story.createdAt.toISOString(),
      updated_at: story.updatedAt.toISOString(),
      published_at: story.publishedAt?.toISOString(),
    });

  if (error) {
    console.error('Error saving story:', error);
    throw error;
  }
}
*/

// Current implementation using localStorage
export async function getUserStoriesDB(userId: string): Promise<Story[]> {
  return getUserStories(userId);
}

export async function saveStoryDB(story: Story, userId: string): Promise<void> {
  saveUserStory(userId, story);
}

export async function deleteStoryDB(storyId: string, userId: string): Promise<void> {
  const { deleteUserStory } = await import('./storage');
  deleteUserStory(userId, storyId);
}

