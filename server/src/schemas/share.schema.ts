import mongoose, { Document, Types } from 'mongoose';
import { string } from 'zod';

export interface IShare extends Document {
  userId: Types.ObjectId;
  share: boolean;
  shareLink: string;
}

const shareSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    share: {
      type: Boolean,
      default: false,
    },
    shareLink: {
      type: string,
      required: true,
    },
  },
  { timestamps: true }
);

const Share = mongoose.model<IShare>('Share', shareSchema);

export default Share;
