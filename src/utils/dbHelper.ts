import Contract from '../models/contract';
import RevokedToken from '../models/removedToken';
import User from '../models/user';
import { generateOTP } from './helper';

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return false;
  }
  return user;
};

export const findUserByWalletAddress = async (walletAddress: string) => {
  const user = await User.findOne({
    walletAddress: { $in: [walletAddress] },
  });
  if (!user) {
    return false;
  }
  return user;
};

export const createUser = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    email,
    name,
    otp: otpGenerated,
  });
  if (!newUser) {
    throw new Error('Unable to sign you up');
  }
  return newUser;
};

export const createContract = async ({
  name,
  contractAddress,
  walletAddress,
  symbol,
  tx,
}: {
  contractAddress: string;
  walletAddress: string;
  name: string;
  symbol: string;
  tx: string;
}) => {
  const newContract = await Contract.create({
    name,
    contractAddress,
    walletAddress,
    symbol,
    tx,
  });
  if (!newContract) {
    throw new Error('Unable to create contract');
  }
  return newContract;
};

export async function invalidateToken(tokenId: string) {
  const revokedToken = new RevokedToken({ tokenId });
  await revokedToken.save();
}

export async function isTokenRevoked(tokenId: string) {
  const count = await RevokedToken.countDocuments({ tokenId });
  return count > 0;
}
