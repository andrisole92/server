const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect,it} = chai;
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Auth Controller Test', () => {
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

    it('should create a new user if the user name is not in the database', async () => {
        try {
            let r = await s.post('/users/auth/in').send({_id: userId1, name: "idiot"});
            const {user} = r.body;
            expect(r.statusCode).to.be.equal(200);
            expect(user.new).to.be.equal(true);
            expect(user.name).to.be.equal('idiot');
        } catch (err) {
            throw err;
        }

    });

    it('should retrieve user data from the database if the user name exists in the database', async () => {
        try {
            let r = await s.post('/users/auth/in').send({name: "Andre2"});
            const {user} = r.body;
            expect(r.statusCode).to.be.equal(200);
            expect(user.new).to.be.equal(undefined);
            expect(user.name).to.be.equal('Andre2');
        } catch (err) {
            throw err;
        }
    });
});