const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true, unique: true}
},{timestamps: true});

userSchema.methods.joinRoom = () => {

};

userSchema.methods.leaveRoom = (callback) => {
};

userSchema.methods.sendMessage = (callback) => {
};


//2
userSchema.methods.getRooms = (callback) => {
};

userSchema.methods.findOneOrCreate = (condition, callback) => {

};



const User = mongoose.model('User', userSchema);
module.exports = User;