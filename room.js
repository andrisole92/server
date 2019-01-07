const mongoose = require('mongoose');


var roomSchema = new mongoose.Schema({
    participants: [String]
});

var Room = mongoose.model('Room', roomSchema);
module.exports = Room;
