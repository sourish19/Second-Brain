import mongoose, { Document, Types } from 'mongoose';

interface IContent extends Document {
  userId: Types.ObjectId;
  title: string;
  type: string;
  link: string;
  tags: Types.ObjectId[];
}

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['document', 'tweet', 'youtube', 'link'],
      default: 'link',
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: [{ type: Types.ObjectId, ref: 'Tags' }],
  },
  { timestamps: true }
);

const Content = mongoose.model<IContent>('Content', contentSchema);

export default Content;
