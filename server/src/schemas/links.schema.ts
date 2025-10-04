import mongoose, { Document, Types } from 'mongoose';

interface ILinks extends Document {
  hashedLink: string;
  userId: Types.ObjectId;
}
// add indexing for {userid,hashedLink} one use - no duplicate link
const linksSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required:true
    },
    hashedLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Links = mongoose.model<ILinks>('Links', linksSchema);

export default Links;
