export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  preferences: {
    favoriteGenres: string[];
    readingLevel: 'beginner' | 'intermediate' | 'advanced';
    theme: 'light' | 'dark' | 'auto';
  };
  achievements: Achievement[];
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'reading' | 'writing' | 'creativity' | 'social';
}
