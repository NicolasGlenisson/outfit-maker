// Clothing categories
export enum Category {
  TOP = 'top',
  BOTTOM = 'bottom',
  DRESS = 'dress',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
  OUTERWEAR = 'outerwear',
  UNDERWEAR = 'underwear',
  SPORTSWEAR = 'sportswear',
  SWIMWEAR = 'swimwear',
  OTHER = 'other',
}

// Seasons applicable to clothing items
export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
}

// Usage occasions for clothing items
export enum Occasion {
  CASUAL = 'casual',
  FORMAL = 'formal',
  SPORT = 'sport',
  PARTY = 'party',
  WORK = 'work',
  HOME = 'home',
  TRAVEL = 'travel',
}

// Clothing interface
export interface Clothing {
  clientId: string; // Using string for UUID or unique identifiers on the frontend
  name: string;
  category: Category;
  color?: string;
  brand?: string;
  imageUrl?: string;
  seasons: Season[];
  occasions: Occasion[];
  createdAt: Date;
  updatedAt: Date;
  isSynced: boolean;
  isDeleted?: boolean;
}

// Interface for the clothing creation/modification form
export type ClothingFormData = Omit<
  Clothing,
  'clientId' | 'createdAt' | 'updatedAt' | 'isSynced'
>;

// Interface for a complete outfit
export interface Outfit {
  id: string;
  name: string;
  imageUrl?: string;
  clothes: Clothing[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the outfit form
export type OutfitFormData = Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>;

// Interface for scheduling an outfit
export interface OutfitSchedule {
  id: string;
  date: Date;
  outfitId: string;
  createdAt: Date;
  updatedAt: Date;
}

// User interface (for future implementation with authentication)
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

export interface UserAPI {
  _id: string;
  deviceId: string;
  createdAt: string;
  updatedAt: string;
}
