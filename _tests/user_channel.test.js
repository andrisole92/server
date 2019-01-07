const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Channel = require('../models/channel');

describe('User Channel Relationship', () => {
    const s = request(app.listen());
    let userId1 = new ObjectId();
    let userId2 = new ObjectId();
    let userId3 = new ObjectId();
    let channelId1 = new ObjectId();
    let channelId2 = new ObjectId();
    let channelId3 = new ObjectId();
    const prefix = '/users/' + userId1.toString();

    before(async () => {
        try {
            await User.remove({});
            await Channel.remove({});
            await User.create([
                {_id: userId1, name: 'test1'},
                {_id: userId2, name: 'test2'},
                {_id: userId3, name: 'test3'}
            ]);
            await Channel.create([
                {_id: channelId1, owner: userId1, private: true},
                {_id: channelId2, owner: userId2},
                {_id: channelId3, owner: userId3}
            ]);
        } catch (err) {
            throw err;
        }


    });
    after(async () => {
        // await Channel.remove({});
        // await User.remove({});
    });

    it('should add multiple users to the channel', async () => {
        try {
            let res = await Channel.findByIdAndUpdate(channelId1.toString(), {$addToSet: {users: [userId1, userId2, userId3]}});
            let channel = await Channel.findById(channelId1.toString());
            console.log(channel);
            expect(channel).to.be.a('object');
            expect(channel.users).to.be.a('array');
            expect(channel.users).to.include(userId1.toString());
            expect(channel.users).to.include(userId2.toString());
            expect(channel.users).to.include(userId3.toString());
        } catch (err) {
            throw err
        }
    });

    it('should remove one user from the channel', async () => {
        try {
            await Channel.findByIdAndUpdate(channelId1.toString(), {$pull: {users: userId3}});
            let channel = await Channel.findById(channelId1.toString());
            expect(channel).to.be.a('object');
            expect(channel.users).to.be.a('array');
            expect(channel.users).to.include(userId1.toString());
            expect(channel.users).to.include(userId2.toString());
            expect(channel.users).to.not.include(userId3.toString());
        } catch (err) {
            throw err;
        }
    });

    it('should remove multiple users from the channel', async () => {
        try {
            await Channel.findByIdAndUpdate(channelId1.toString(), {$pullAll: {users: [userId1, userId2]}});
            let channel = await Channel.findById(channelId1.toString());
            expect(channel).to.be.a('object');
            expect(channel.users).to.be.a('array');
            expect(channel.users).to.not.include(userId1.toString());
            expect(channel.users).to.not.include(userId2.toString());
            expect(channel.users).to.not.include(userId3.toString());
        } catch (err) {
            throw err;
        }
    });
    // it('user should join the channel', async () => {
    //     try {
    //         let r = await s.post(prefix+'/channels/'+channelId1.toString()+'/join');
    //         console.log(r.body);
    //         expect(r.statusCode).to.be.equal(200);
    //         expect(r.body.s).to.be.a('boolean');
    //         expect(r.body.s).to.be.equal(true);
    //         let channel = await Channel.findById(channelId1.toString());
    //         expect(channel).to.be.a('object');
    //         expect(channel.users).to.be.a('array');
    //         expect(channel.users.length).to.be.equal(1);
    //         expect(channel.users).to.include(userId1.toString());
    //
    //     } catch (err) {
    //         throw err;
    //     }
    // });
    // it('user should not join the channel twice', async () => {
    //     try {
    //         let r = await s.post(prefix+'/channels/'+channelId1.toString()+'/join').send({uId: userId1});
    //         console.log(r.body);
    //         expect(r.statusCode).to.be.equal(200);
    //         expect(r.body.s).to.be.a('boolean');
    //         expect(r.body.s).to.be.equal(true);
    //         let channel = await Channel.findById(channelId1.toString());
    //         expect(channel).to.be.a('object');
    //         expect(channel.users).to.be.a('array');
    //         expect(channel.users.length).to.be.equal(1);
    //         expect(channel.users).to.include(userId1.toString());
    //
    //     } catch (err) {
    //         throw err;
    //     }
    // });
    // it('user should leave the channel', async () => {
    //     try {
    //         let r = await s.post(prefix+'/channels/'+channelId1.toString()+'/leave').send({uId: userId1});
    //         console.log(r.body);
    //         expect(r.statusCode).to.be.equal(200);
    //         expect(r.body.s).to.be.a('boolean');
    //         expect(r.body.s).to.be.equal(true);
    //         let channel = await Channel.findById(channelId1.toString());
    //         expect(channel).to.be.a('object');
    //         expect(channel.users).to.be.a('array');
    //         expect(channel.users.length).to.be.equal(0);
    //         expect(channel.users).to.not.include(userId1.toString());
    //
    //     } catch (err) {
    //         throw err;
    //     }
    // });
});