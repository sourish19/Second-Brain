import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, 'Name must be at least 3 characters long'],
      max: 10,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, 'Password must be at least 8 characters long'],
      max: 20,
    },
    loginType: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified(user.password)) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error occured while hashing password');
    next();
  }
});

const User = mongoose.model('user', userSchema);

export default User;
