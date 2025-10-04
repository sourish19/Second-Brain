import { IUser } from '../schemas/auth.schema';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
