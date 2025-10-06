import mongoose, { Document } from 'mongoose';

interface ITags extends Document {
  tagTitle: string;
}
// Implement Indexing later
const tagsSchema = new mongoose.Schema(
  {
    tagTitle: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Tags = mongoose.model<ITags>('Tags', tagsSchema);

export default Tags;
