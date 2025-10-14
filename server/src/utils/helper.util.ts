import crypto from 'crypto';

type TToken = {
  randomToken: string;
  hashedToken: string;
};

export const generateHash = (token: string): string => {
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
    .toString();
  return hash;
};

export const generateShareableLink = (): TToken => {
  const randomToken = crypto.randomBytes(10).toString('hex');
  const hashedToken = generateHash(randomToken);
  return { randomToken, hashedToken };
};
