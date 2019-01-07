const express = require('express');
const router = express.Router({mergeParams: true});
const Message = require('../models/message');
router.get('/', async (req, res, next) => {
    const {userId, channelId} = req.params;
    try {
        const messages = await Message.find({channelId});
        res.status(200).send({messages});
    } catch (err) {
        res.status(403).send({err});
        return next(err);
    }
});
router.post('/', async (req, res, next) => {
    const {userId, channelId} = req.params;
    const message = new Message({...req.body, from: userId, channelId});
    try {
        await message.save();
        let io = req.app.get('io');
        io.to(channelId).emit('message', {channelId, message});
        res.status(200).send({message});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
        return next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message === null) {
            res.status(404).send({message: 'not found'});
        } else {
            res.status(200).send({message});
        }
    } catch (err) {
        res.sendStatus(403);
        return next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).send({s: true, message});
    } catch (err) {
        res.sendStatus(403);
        return next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const r = await Message.findByIdAndRemove(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(403);
        return next(err);
    }
});

module.exports = router;
