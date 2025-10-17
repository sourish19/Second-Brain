import crypto from 'crypto';

export const generateHash = (token: string): string => {
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
    .toString();
  return hash;
};

export const generateShareableLink = (): string => {
  const randomToken = crypto.randomBytes(10).toString('hex');
  return randomToken;
};
