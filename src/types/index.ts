import { JwtPayload } from 'jsonwebtoken';

export interface IUser extends Document {
  name?: string;
  email: string;
  walletAddress: string[];
  created: string;
  lastActive?: string;
  active: boolean;
  otp?: string;
}

export interface RevokedTokenModel extends Document {
  tokenId: string;
}

export interface IJWTPayload extends JwtPayload {
  user: IUser;
  iat: number;
}

export interface IContractAddress extends Document {
  name: string;
  symbol: string;
  contractAddress: string;
  walletAddress: string;
  tx: string;
  created: string;
}
