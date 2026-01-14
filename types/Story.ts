import { Character } from './Character';

export interface Story {
  id: string;
  title: string;
  description: string;
  genre: string;
  ageRange: {
    min: number;
    max: number;
  };
  coverImage: string;
  coverImageBack?: string;
  pages: StoryPage[];
  characters: Character[];
  settings: {
    location: string;
    timePeriod: string;
    mood: string;
  };
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  author: {
    id: string;
    name: string;
  };
  sharedWith?: {
    parentEmails: string[];
    parentNames: string[];
  };
  isShared?: boolean;
  isExample?: boolean; // Flag for example stories that shouldn't be edited/deleted
}

export interface StoryPage {
  id: string;
  pageNumber: number;
  title: string;
  content: string;
  image?: string;
  layout: 'image-text' | 'text-image';
  characters: string[]; // character IDs that appear on this page
  settings: {
    location?: string;
    timeOfDay?: string;
    weather?: string;
  };
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ageRanges: {
    min: number;
    max: number;
  }[];
  popularThemes: string[];
}
