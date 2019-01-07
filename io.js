const io = require('socket.io')(4001);

const channels = io.of('/channels');
const messages = io.of('/messages');
console.log('sockets')
io.on('connection', (socket) => {

    // joining channels
    // param list of channels to join
    socket.on('join', (channels) => {
        console.log('join');
        console.log(channels);
        channels.forEach((channel) => {
            socket.join(channel);
            const channelId = channel;
            const m = {a:'whatever'};
        });
    });
});



module.exports = io;