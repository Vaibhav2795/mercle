import mongoose, { Schema } from 'mongoose';
import { RevokedTokenModel } from '../types';

const RevokedTokenSchema = new Schema<RevokedTokenModel>({
  tokenId: { type: String, required: true },
});

const RevokedToken = mongoose.model<RevokedTokenModel>(
  'RevokedToken',
  RevokedTokenSchema,
);

export default RevokedToken;
