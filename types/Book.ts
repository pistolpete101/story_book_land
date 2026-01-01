export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  genre: string;
  ageRange: {
    min: number;
    max: number;
  };
  pages: Page[];
  readingTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  pageNumber: number;
  content: string;
  image?: string;
  audioUrl?: string;
  layout: 'image-text' | 'text-image';
}
