import mongoose, { Document } from 'mongoose';

export interface ITags extends Document {
  tagTitle: string;
}
// Implement Indexing later
const tagsSchema = new mongoose.Schema(
  {
    tagTitle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Tags = mongoose.model<ITags>('Tags', tagsSchema);

export default Tags;
