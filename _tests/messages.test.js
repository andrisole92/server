const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../app');
const Message = require('../models/message');
const Channel = require('../models/channel');
const User = require('../models/user');

describe('Message Controller Test', () => {
    const s = request(app.listen());
    let channelId1 = new ObjectId();
    let channelId2 = new ObjectId();
    let channelId3 = new ObjectId();
    let userId1 = new ObjectId();
    let userId2 = new ObjectId();
    let userId3 = new ObjectId();
    let messageId1 = new ObjectId();
    let messageId2 = new ObjectId();
    let messageId3 = new ObjectId();
    const prefix = '/users/' + userId1.toString() + '/channels/' + channelId1.toString();
    before(async () => {
        try {
            await User.create([{_id: userId1, name: 'test1'}, {_id: userId2, name: 'test2'}, {
                _id: userId3,
                name: 'test3'
            }]);
            await Channel.create([{_id: channelId1, owner: userId1}, {_id: channelId2, owner: userId2}, {
                _id: channelId3,
                owner: userId3
            }]);
            await Message.create([
                {_id: messageId1, from: userId1, channelId: channelId1}, {
                    _id: messageId2,
                    from: userId2,
                    channelId: channelId1
                }, {
                    _id: messageId3,
                    from: userId3,
                    channelId: channelId1
                }]);
        } catch (err) {
            throw err;
        }
    });

    after(async () => {
        await User.remove({_id: {$in: [userId1, userId2, userId3]}});
        await Message.remove({_id: {$in: [messageId1, messageId2, messageId3]}});
        await Channel.remove({_id: {$in: [channelId1, channelId2, channelId3]}});
    });

    it('should read all messages', async () => {
        try {
            let res = await request(app.listen()).get(prefix + '/messages');
            const {messages} = res.body;
            expect(messages).to.be.a('array');
            expect(messages.length).to.be.equal(3);
        } catch (err) {
            throw err;
        }
    });

    it('should create a new message and return id given channelId an sender Id', async () => {
        try {
            let res = await s.post(prefix + '/messages').send({channelId: channelId1, from: userId1});
            const {message} = res.body;
            expect(message._id).to.be.a('string');
        } catch (err) {
            throw err;
        }
    });
    it('should read a message if I have the permission to read it', async () => {
        try {
            let res = await s.get(prefix + '/messages/' + messageId1);
            const {message} = res.body;
            expect(message.body).to.be.a('string');
            expect(message._id.toString()).to.be.equal(messageId1.toString());
        } catch (err) {
            throw err;
        }
    });
    it('should update a message if I am signed in and owner of the message', async () => {
        try {
            let res = await s.put(prefix + '/messages/'+messageId1.toString()).send({body: 'loh'});
            const {message} = res.body;
            expect(message.body).to.be.a('string');
            expect(message._id.toString()).to.be.equal(messageId1.toString());
        } catch (err) {
            throw err;
        }
    });
    it('should delete a message if I am signed in and owner of the message', async () => {
        try {
            let res = await s.delete(prefix + '/messages/' + messageId1.toString());
            let res2 = await s.get(prefix+'/messages/' + messageId1);
            console.log(res.body);
            expect(res2.body.message).to.be.equal('not found');
        } catch (err) {
            throw err;
        }
    });

});