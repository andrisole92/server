const chai = require('chai');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {expect} = chai;
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Room = require('../models/channel');

describe('Room and Message Relationship Test', () => {
    const s = request(app.listen());
    let userId1 = new ObjectId();
    let userId2 = new ObjectId();
    let userId3 = new ObjectId();
    let roomId1 = new ObjectId();
    let roomId2 = new ObjectId();
    let roomId3 = new ObjectId();
    before(async () => {

    });
    after(async () => {
    });

});