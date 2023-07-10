import mongoose, { Schema } from 'mongoose';
import { IContractAddress } from '../types';

const contractSchema: Schema<IContractAddress> = new Schema<IContractAddress>({
  name: {
    type: String,
    required: false,
  },
  symbol: {
    type: String,
    required: false,
  },
  tx: {
    type: String,
    required: false,
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: { type: String, required: true },

  created: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Contract = mongoose.model<IContractAddress>('Contract', contractSchema);

export default Contract;
