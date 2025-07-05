export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'herbs' | 'oils' | 'teas' | 'supplements' | 'skincare';
  doshaBalancing: ('vata' | 'pitta' | 'kapha')[];
  benefits: string[];
  ingredients: string[];
  usage: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: Service;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export type DohaType = 'vata' | 'pitta' | 'kapha';

export interface DoshaQuizQuestion {
  id: number;
  question: string;
  options: {
    vata: string;
    pitta: string;
    kapha: string;
  };
}

export interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  [key: string]: number; // Allow indexing with string
}

export interface DoshaDescription {
  title: string;
  shortDescription: string;
  longDescription: string;
  characteristics: string[];
  recommendations: string[];
}

export interface DoshaDescriptions {
  vata: DoshaDescription;
  pitta: DoshaDescription;
  kapha: DoshaDescription;
  [key: string]: DoshaDescription; // Allow indexing with string
}

export type Dosha = 'vata' | 'pitta' | 'kapha';