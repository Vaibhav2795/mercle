import jwt from 'jsonwebtoken';
import {
  createEtherInstance,
  generateOTP,
  requirePanic,
  sendMail,
} from '../utils/helper';
import {
  createUser,
  findUserByEmail,
  findUserByWalletAddress,
  invalidateToken,
} from '../utils/dbHelper';
import { ENV } from '../config/env';
import { ethers, utils } from 'ethers';

export async function signUp(payload: { email: string; name: string }) {
  let { email } = payload;
  const { name } = payload;
  requirePanic({ email, name }, ['email', 'name']);
  email = email.toLowerCase();

  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    throw new Error('User already exists');
  }

  const newUser = await createUser({ email, name });

  if (!newUser) {
    throw new Error('Unable to create new user');
  }

  await sendMail({
    to: newUser.email,
    otp: newUser.otp,
    service: 'Signup',
    name: newUser.name,
  });
  return newUser;
}

export const verifyOTP = async (payload: { email: string; otp: string }) => {
  let { email } = payload;
  const { otp } = payload;
  requirePanic({ email, otp }, ['email', 'otp']);
  email = email.toLowerCase();

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  user.otp = undefined;
  user.active = true;
  const jwtPayload = {
    user,
    iat: Math.round(new Date().getTime() / 1000),
  };

  const token = jwt.sign(JSON.stringify(jwtPayload), ENV.JWT_SECRET_KEY);

  await user.save();

  return { message: 'Success!', token };
};

export async function signIn(payload: { email: string }) {
  let { email } = payload;
  requirePanic({ email }, ['email']);
  email = email.toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const otp = generateOTP();
  user.otp = otp;
  await user.save();
  await sendMail({ to: email, otp, service: 'Signin', name: user.name });

  return { message: 'OTP sent successfully', otp };
}

export async function logout(payload: { token: string; email: string }) {
  const { token, email } = payload;
  requirePanic({ token, email }, ['token', 'email']);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  user.active = false;
  await user.save();
  await invalidateToken(token);
  return { message: 'Logout successful' };
}

export async function userInfo(payload: { email: string }) {
  let { email } = payload;
  requirePanic({ email }, ['email']);
  email = email.toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export async function updateUser(payload: {
  email: string;
  id: string;
  name: string;
  walletAddress: string[];
}) {
  let { email } = payload;
  const { name, walletAddress } = payload;
  requirePanic({ email }, ['email']);

  email = email.toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if (walletAddress && walletAddress.length > 0) {
    const newAddresses = walletAddress.filter(
      (address) => !user.walletAddress.includes(address),
    );
    user.walletAddress.push(...newAddresses);
  }
  const updatedUser = await user.save();

  return updatedUser;
}

export async function generateSignature(payload: { privateKey: string }) {
  const message = 'Unique message to be signed';
  const { privateKey } = payload;
  const wallet = new ethers.Wallet(privateKey, createEtherInstance());
  const signature = wallet.signMessage(message);
  return signature;
}

export async function signinWithWalletAddress(payload: {
  signature: string;
  walletAddress: string;
}) {
  const { signature, walletAddress } = payload;
  const message = 'Unique message to be signed';
  const isSignatureValid =
    utils.verifyMessage(message, signature) === walletAddress;

  if (!isSignatureValid) {
    throw new Error('Invalid signature');
  }

  const user = await findUserByWalletAddress(walletAddress);
  if (!user) {
    throw new Error('User not found');
  }

  user.otp = undefined;
  user.active = true;
  const jwtPayload = {
    user,
    iat: Math.round(new Date().getTime() / 1000),
  };

  const token = jwt.sign(JSON.stringify(jwtPayload), ENV.JWT_SECRET_KEY);
  await user.save();

  return { message: 'Success!', token };
}
