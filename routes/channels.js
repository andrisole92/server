const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams:true});
const Channel = require('../models/channel');
const ObjectId = mongoose.Types.ObjectId;

router.get('/', async (req, res, next) => {
    const {userId} = req.params;
    try {
        const channels = await Channel.find({users: ObjectId(userId)}).populate('users').exec();
        console.log(channels[1]);
        res.status(200).send({channels});
    } catch (err) {
        res.status(403).send(err);
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const channel = await Channel.findOne({_id:id}).populate('users').exec();
        if (channel === null){
            res.status(404).send({channel: 'not found'});
        } else {
            res.status(200).send({channel});
        }
    } catch (err) {
        res.status(404).send({err});
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const channel = new Channel(req.body);
    try {
        const r = await channel.save();
        res.status(200).send(r);
    } catch (err) {
        res.status(500).send({err});
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const r = await Channel.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).send(r);
    } catch (err) {
        res.status(500).send({err});
        next(err);
    }
});

// kill the chat
router.delete('/:id', async (req, res, next) => {
    try {
        await Channel.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send({err});
        next(err);
    }
});

// add users
router.post('/:id/add', async (req, res, next) => {
    const {id} = req.params;
    let {users} = req.body;
    try {
        let r = await Channel.findOneAndUpdate({_id: id}, {$addToSet: {users: users}});
        res.status(200).send({_id: r._id});
    } catch (err) {
        res.status(500).send({err});
        next(err);
    }
});

// ban users
router.post('/:id/ban', async (req, res, next) => {
    const {id, userId} = req.params;
    try {
        await Channel.findByIdAndUpdate(id, {$addToSet: {banned: [userId]}});
        res.status(200).send({s: true});
    } catch (err) {
        console.log(err);
        res.status(500).send({e: err});
        next(err);
    }
});

// block users
router.post('/:id/block', async (req, res, next) => {
    const {id, userId} = req.params;
    try {
        // dope
        await Channel.findByIdAndUpdate(id, {$addToSet: {blocked: [userId]}});
        res.status(200).send({s: true});
    } catch (err) {
        console.log(err);
        res.status(500).send({e: err});
        next(err);
    }
});

// leave channel
router.post('/:id/leave', async (req, res, next) => {
    const {id,userId} = req.params;
    try {
        await Channel.findByIdAndUpdate(id, {$pull: {participants: userId}});
        res.status(200).send({s: true});
    } catch (err) {
        res.status(500).send({e: err});
        next(err);
    }
});

// join channel - if channel is public (v2?)
router.post('/:id/join', async (req, res, next) => {
    const {id, userId} = req.params;
    try {
        // dope
        await Channel.findByIdAndUpdate(id, {$addToSet: {participants: [userId]}});
        res.status(200).send({s: true});
    } catch (err) {
        console.log(err);
        res.status(500).send({e: err});
        next(err);
    }
});

module.exports = router;

