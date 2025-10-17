import mongoose, { Document, Types } from 'mongoose';

export interface IShare extends Document {
  userId: Types.ObjectId;
  share: boolean;
  shareLink: string;
  token: string;
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
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Share = mongoose.model<IShare>('Share', shareSchema);

export default Share;
