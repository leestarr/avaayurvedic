import { User } from '@supabase/supabase-js';
import { RequestHandler, ParamsDictionary, Query } from 'express';
import { RequestBody } from './requests';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

interface CartItem {
  product_id: string;
  quantity: number;
}

interface DoshaQuizResult {
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  primary_dosha: string;
  secondary_dosha?: string;
  quiz_answers: Record<string, unknown>;
}

declare module 'express' {
  interface Request {
    user?: User;
    body: RequestBody;
  }

  interface Response {
    json: (body: unknown) => this;
  }
}

export type AsyncRequestHandler = RequestHandler<ParamsDictionary, unknown, RequestBody, Query>; 