const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;