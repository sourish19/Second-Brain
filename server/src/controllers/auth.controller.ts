import User from '../schemas/auth.schema';
import asyncHandler from '../utils/asyncHandler.util';

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({
    $and: [{ name }, { email }],
  });

  if (!findUser) {
  }
});
