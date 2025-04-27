export interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface DoshaQuizResult {
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  primary_dosha: string;
  secondary_dosha: string;
  quiz_answers: Record<string, string>;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type RequestBody = UserProfile | CartItem | DoshaQuizResult | SignupRequest | LoginRequest; 