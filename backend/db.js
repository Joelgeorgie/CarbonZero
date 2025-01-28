import mongoose from 'mongoose';
import { CONN_STRING } from './config.js';

const { Schema } = mongoose;

mongoose.connect(
  CONN_STRING
);

const companySchema = new Schema({
  name: String,
  publicKey: String,
  password: String,
  czTotal: Number,
  czNeeded: Number,
});

const Company = mongoose.model('Company', companySchema);

export { Company };
