import mongoose from 'mongoose';

class DbConnect {
  dbUrl: string = process.env.DB_URI || '';
  async connection() {
    try {
      await mongoose.connect(this.dbUrl);
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error('Error in connecting Db', error.message);
      else {
        console.error('Error in connecting Db', error);
      }
      throw error;
    }
  }
}

export default new DbConnect();
