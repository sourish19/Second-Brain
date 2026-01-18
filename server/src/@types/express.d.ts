import { IUser } from '../schemas/auth.schema';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export {};
