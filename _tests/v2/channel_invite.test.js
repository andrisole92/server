const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../../app');
const Message = require('../../models/message');
const Room = require('../../models/channel');
const User = require('../../models/user');

// describe('User Room Relationship', () => {
//     const s = request(app.listen());
//     let userId1 = new ObjectId();
//     let userId2 = new ObjectId();
//     let userId3 = new ObjectId();
//     let roomId1 = new ObjectId();
//     let roomId2 = new ObjectId();
//     let roomId3 = new ObjectId();
//     before(async () => {
//         try {
//             await User.remove({});
//             await Room.remove({});
//             await User.create([{_id: userId1, name: 'test1'}, {_id: userId2, name: 'test2'}, {
//                 _id: userId3,
//                 name: 'test3'
//             }]);
//             await Room.create([{_id: roomId1, owner: userId1}, {_id: roomId2, owner: userId2}, {
//                 _id: roomId3,
//                 owner: userId3
//             }]);
//         } catch (err) {
//             throw err;
//         }
//
//
//     });
//     after(async () => {
//         await Room.remove({});
//         await User.remove({});
//     });
//
//
//     it('user can send invite', async () => {
//         try {
//             let r = await s.post('/users/sendInvite').send({uId: userId1, rId: roomId1, fId: userId2});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.i).to.be.a('array');
//             expect(room.i.length).to.be.equal(1);
//             expect(room.participants).to.not.include(userId2.toString());
//
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('user can block the room', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('nobody can invite user who blocked the room', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('owner can ban participant', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('user cant join the room if banned', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('user cant join the room if banned', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('owner can unban participant', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//     it('user can join the room after being unbanned', async () => {
//         try {
//             let r = await s.post('/users/leaveRoom').send({uId: userId1, rId: roomId1});
//             console.log(r.body);
//             expect(r.statusCode).to.be.equal(200);
//             expect(r.body.s).to.be.a('boolean');
//             expect(r.body.s).to.be.equal(true);
//             let room = await Room.findById(roomId1.toString());
//             expect(room).to.be.a('object');
//             expect(room.participants).to.be.a('array');
//             expect(room.participants).to.not.include(userId1.toString());
//
//         } catch (err) {
//             throw err;
//         }
//     });
//
// });
