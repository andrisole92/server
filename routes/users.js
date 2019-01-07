const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/channel');
const io = require('../io');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).send({users});
    } catch (err) {
        res.status(403).send(err);
        return next(err);
    }
});
router.post('/', async (req, res, next) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        res.status(200).send({user});
    } catch (err) {
        res.status(500).send(err);
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        if (user === null) {
            res.status(404).send({user: 'not found'});
        } else {
            res.status(200).send({user});
        }
    } catch (err) {
        res.sendStatus(404);
        return next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).send({s: true});
    } catch (err) {
        res.status(500).send(err);
        return next(err);
    }

});
router.delete('/:id', async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({success: true});
    } catch (err) {
        res.status(500).send(err);
        return next(err);
    }
});

module.exports = router;
