// Catégories de vêtements
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

// Saisons applicables aux vêtements
export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
}

// Occasions d'utilisation des vêtements
export enum Occasion {
  CASUAL = 'casual',
  FORMAL = 'formal',
  SPORT = 'sport',
  PARTY = 'party',
  WORK = 'work',
  HOME = 'home',
  TRAVEL = 'travel',
}

// Interface du vêtement
export interface Clothing {
  clientId: string; // Utilisation de string pour UUID ou identifiants uniques sur le frontend
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

// Interface pour le formulaire de création/modification de vêtement
export type ClothingFormData = Omit<
  Clothing,
  'clientId' | 'createdAt' | 'updatedAt' | 'isSynced'
>;

// Interface pour une tenue complète
export interface Outfit {
  id: string;
  name: string;
  imageUrl?: string;
  clothes: Clothing[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour le formulaire de outfit
export type OutfitFormData = Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>;

// Interface pour planifier une tenue
export interface OutfitSchedule {
  id: string;
  date: Date;
  outfitId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour l'utilisateur (pour une future implémentation avec authentication)
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
