const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User Controller', () => {
    const s = request(app.listen());
    let userId1 = new ObjectId();
    let userId2 = new ObjectId();
    let userId3 = new ObjectId();
    before(async () => {
        await User.create([{_id: userId2, name: 'Andre2'}, {
            _id: userId3,
            name: 'Andre3'
        }]);
    });

    after(async () => {
        await User.remove({_id: {$in: [userId1, userId2, userId3]}});
    });

    it('should create a new user and return id', async () => {
        try {
            let r = await s.post('/users').send({_id: userId1,name: "Andre"});
            const {user} = r.body;
            expect(r.statusCode).to.be.equal(200);
            expect(user._id).to.be.a('string');
            expect(user.name).to.be.equal('Andre');
        } catch (err) {
            throw err;
        }

    });

    it('should have all 3 users', async () => {
        try {
            let r = await s.get('/users/');
            const {users} = r.body;

            expect(users).to.be.a('array');
            expect(users.length).to.be.equal(3);
        } catch (err) {
            throw err;
        }
    });
    it('should read a user', async () => {
        try {
            let r = await s.get('/users/' + userId1);
            const {user} = r.body;
            expect(user.name).to.be.a('string');
            expect(user._id.toString()).to.be.equal(userId1.toString());
        } catch (err) {
            throw err;
        }

    });
    it('should update a user', async () => {
        try {
            let r = await s.put('/users/'+userId1).send({name: 'loh'});
            expect(r.body.s).to.be.a('boolean');
            expect(r.body.s).to.be.equal(true);
            let user = await User.findById(userId1);
            expect(user).to.be.a('object');
            expect(user.name).to.be.a('string');
            expect(user.name).to.not.be.equal('losh');
            expect(user.name).to.be.equal('loh');
        } catch (err) {
            throw err;
        }

    });
    it('should delete a user', async () => {
        try {
            let r = await s.delete('/users/'+userId1);
            expect(r.statusCode).to.be.equal(200);
            let r2 = await s.get('/users/' + userId1);
            console.log(r2.body);
            expect(r2.statusCode).to.be.equal(404);
            expect(r2.body.user).to.be.equal('not found');
        } catch (err) {
            throw err;
        }

    });

});