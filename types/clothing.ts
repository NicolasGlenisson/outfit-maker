// Catégories de vêtements
export enum Category {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  DRESS = "DRESS",
  SHOES = "SHOES",
  ACCESSORIES = "ACCESSORIES",
  OUTERWEAR = "OUTERWEAR",
  UNDERWEAR = "UNDERWEAR",
  SPORTSWEAR = "SPORTSWEAR",
  SWIMWEAR = "SWIMWEAR",
  OTHER = "OTHER",
}

// Saisons applicables aux vêtements
export enum Season {
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  AUTUMN = "AUTUMN",
  WINTER = "WINTER",
}

// Occasions d'utilisation des vêtements
export enum Occasion {
  CASUAL = "CASUAL",
  FORMAL = "FORMAL",
  SPORT = "SPORT",
  PARTY = "PARTY",
  WORK = "WORK",
  HOME = "HOME",
  TRAVEL = "TRAVEL",
}

// Interface du vêtement
export interface Clothing {
  id: string; // Utilisation de string pour UUID ou identifiants uniques sur le frontend
  name: string;
  category: Category;
  color?: string;
  brand?: string;
  imageUrl?: string;
  seasons: Season[];
  occasions: Occasion[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour le formulaire de création/modification de vêtement
export type ClothingFormData = Omit<Clothing, "id" | "createdAt" | "updatedAt">;

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
export type OutfitFormData = Omit<Outfit, "id" | "createdAt" | "updatedAt">;

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
