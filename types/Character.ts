export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  personality: {
    traits: string[];
    likes: string[];
    dislikes: string[];
  };
  appearance: {
    hairColor: string;
    eyeColor: string;
    clothing: string;
    accessories: string[];
  };
  role: 'protagonist' | 'antagonist' | 'supporting' | 'narrator' | string; // Allow custom roles
  age?: number;
  species?: string;
  powers?: string[];
}
