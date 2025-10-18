import mongoose from 'mongoose';
import { InternalServerError } from '../utils/apiError.util';

import ENV from './env.config';

class DbConnect {
  dbUrl: string = ENV.DB_URI;
  async connection() {
    try {
      await mongoose.connect(this.dbUrl);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InternalServerError(
          `Error in connecting Db: ${error.message}`
        );
      else {
        throw new InternalServerError('Error in connecting Db');
      }
    }
  }
}

export default new DbConnect();
