const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;


const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true, unique: true},
    email: {type: String, required: true, index: true, unique: true},
    apiKey: {type: String, required: true, index: true, unique: true}
},{timestamps: true});

customerSchema.add = (callback) => {

};

customerSchema.editMessage = (callback) => {

};

customerSchema.removeMessage = (callback) => {

};


const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;