export enum Category {
  SIGHTS = 'SIGHTS',
  FOOD = 'FOOD',
  NIGHTLIFE = 'NIGHTLIFE',
  EVENTS = 'EVENTS',
  INFO = 'INFO',
}

export interface TravelCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: Category;
  dateAdded?: number;
  // New optional fields for Events
  location?: string;
  date?: string;
  time?: string;
  address?: string;
  price?: string; // Keeping as string to allow "20€" or "Free" or just numbers
}

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  icon: 'plane' | 'hotel' | 'info';
  isReturn?: boolean;
}