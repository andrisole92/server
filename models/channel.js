const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


privateChannelValidator = (value) => {
    // return true;
    // const r = value.length <= 2;
    // console.log(r);
    // return r;
    // if (!this.private) {
    //     console.log('jus true: ' + value.length <= 2)
    //     return true;
    // } else {
    //     console.log('yo: ' + value.length <= 2)
    //     return value.length <= 2;
    // }
};

const channelSchema = new mongoose.Schema({
    _private: {type: Boolean, default: false},
    _direct: {type: Boolean, default: false},
    name: {type: 'String', default: ''},
    owner: {type: ObjectId, ref: 'User'},
    users: [{
        type: ObjectId, default: [], ref: 'User', maxLength: 100,
        validate: [privateChannelValidator, 'Private Room 2 participants max']
    }],
    banned: {type: [ObjectId], default: [], maxLength: 100},
    blocked: {type: [ObjectId], default: [], maxLength: 100}
}, {timestamps: true});

channelSchema.methods.addParticipants = () => {
    if (this.private) return false
};

channelSchema.pre('findOneAndUpdate', function (next) {
    next();
});

const Channel = mongoose.model('Channel', channelSchema);
module.exports = Channel;

