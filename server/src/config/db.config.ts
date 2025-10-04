import mongoose from 'mongoose';

class DbConnect {
  dbUrl: string = process.env.DB_URI || '';
  async connection() {
    try {
      await mongoose.connect(this.dbUrl);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new Error(`Error in connecting Db: ${error.message}`);
      else {
        throw new Error('Error in connecting Db');
      }
      throw error;
    }
  }
}

export default new DbConnect();
