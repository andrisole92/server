const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../app');
const Channel = require('../models/channel');
const User = require('../models/user');

describe('Channels Controller', () => {
    const s = request(app.listen());
    let userId1 = new ObjectId();
    let userId2 = new ObjectId();
    let userId3 = new ObjectId();
    let channelId1 = new ObjectId();
    let channelId2 = new ObjectId();
    let channelId3 = new ObjectId();
    before(async () => {
        await User.create([{_id: userId1, name: 'Andre'}, {_id: userId2, name: 'Andre2'}, {
            _id: userId3,
            name: 'Andre3'
        }]);
        await Channel.create([{_id: channelId2}, {_id: channelId3, users: [userId1, userId2]}])
    });

    after(async () => {
        await User.remove({_id: {$in: [userId1,userId2,userId3]}});
        await Channel.remove({_id: {$in: [channelId1,channelId2,channelId3]}});
    });

    it('should create a new channel and return id', async () => {
        try {
            let res = await s.post('/users/' + userId1.toString() + '/channels/').send({
                _id: channelId1,
                users: [userId1, userId2, userId3],
                name: "idiot"
            });
            console.log(res.body);
            expect(res.body._id).to.be.a('string');
        } catch (err) {
            throw err;
        }
    });
    it('should read a channel', async () => {
        try {
            let res = await s.get('/users/' + userId1.toString() + '/channels/' + channelId1.toString());
            const {channel} = res.body;
            expect(channel.name).to.be.a('string');
            expect(channel._id.toString()).to.be.equal(channelId1.toString());
        } catch (err) {
            throw err;
        }
    });
    it('should read all channels that belong to the user', async () => {
        try {
            let res = await s.get('/users/' + userId1.toString() + '/channels');
            const {channels} = res.body;
            expect(channels).to.be.a('array');
            expect(channels.length).to.be.equal(2);
            // have the user
            expect(channels[0].users.map((u) => u._id).indexOf(userId1.toString())).not.to.be.equal(-1);
            expect(channels[1].users.map((u) => u._id).indexOf(userId1.toString())).not.to.be.equal(-1);
        } catch (err) {
            throw err;
        }
    });
    it('should update a room', async () => {
        try {
            let res = await s.put('/users/' + userId1.toString() + '/channels/' + channelId1.toString());
            expect(res.body.name).to.be.a('string');
            expect(res.body._id.toString()).to.be.equal(channelId1.toString());
        } catch (err) {
            throw err;
        }
    });
    it('should delete a room', async () => {
        try {
            await s.delete('/users/' + userId1.toString() + '/channels/' + channelId1.toString());
            let res2 = await s.get('/users/' + userId1.toString() + '/channels/' + channelId1.toString());
            expect(res2.statusCode).to.be.equal(404);
            expect(res2.body.channel).to.be.equal('not found');
            return;
        } catch (err) {
            throw err;
        }

    });

});