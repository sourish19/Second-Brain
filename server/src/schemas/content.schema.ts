import mongoose, { Document, Types } from 'mongoose';
import {
  AVAILABLE_CONTENT_TYPES,
  CONTENT_TYPES,
} from '../utils/constants.util';
import { string } from 'zod';

export interface IContent extends Document {
  userId: Types.ObjectId;
  title: string;
  type: string;
  link: Types.ObjectId;
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
      type: string,
      enum: AVAILABLE_CONTENT_TYPES,
      default: CONTENT_TYPES.OTHER,
      required: true,
    },
    link: {
      type: Types.ObjectId,
      ref: 'Links',
      required: true,
    },
    tags: [{ type: Types.ObjectId, ref: 'Tags' }],
  },
  { timestamps: true }
);

const Content = mongoose.model<IContent>('Content', contentSchema);

export default Content;
