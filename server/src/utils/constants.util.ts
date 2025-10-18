import { CookieOptions } from 'express';

import ENV from '../config/env.config';

export const cookieOptions: CookieOptions = {
  sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: ENV.NODE_ENV === 'production',
  httpOnly: true,
  path: '/',
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15d
};

export enum CONTENT_TYPES {
  ARTICLE = 'article',
  TWEET = 'tweet',
  YOUTUBE = 'youtube',
  OTHER = 'other',
}

export const AVAILABLE_CONTENT_TYPES: CONTENT_TYPES[] =
  Object.values(CONTENT_TYPES);

export const NO_IMAGE = 'https://placehold.co/600x400';
