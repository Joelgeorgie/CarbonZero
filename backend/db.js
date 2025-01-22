const mongoose =require('mongoose');
const { Schema } = mongoose;
const { CONN_STRING } = require('./config');

mongoose.connect(CONN_STRING);

const companySchema = new Schema({
  name : String,
  publicKey: String, 
  password: String,
  czTotal: Number,
  czNeeded: Number
});

const Company = mongoose.model('Company', companySchema);


module.exports = {
	Company
}