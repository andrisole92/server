const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;


const messageSchema = new mongoose.Schema({
    channelId: {type: ObjectId, ref: 'Channel', required: true},
    body: {type: String, default: '', maxlength: 300},
    from: {type: ObjectId, ref: 'User', required: true},
    time: {type: Number, default: Date.now()},
    type: {type: String, maxlength: 50},
    read: {type: [ObjectId], ref: 'User'} // read by who?
},{timestamps: true});

messageSchema.add = (callback) => {

};

messageSchema.editMessage = (callback) => {

};

messageSchema.removeMessage = (callback) => {

};


const Message = mongoose.model('Message', messageSchema);
module.exports = Message;