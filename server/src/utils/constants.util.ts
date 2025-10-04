import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  path: '/',
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15d
};
