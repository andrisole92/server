const express = require('express');
const router = express.Router();
const User = require('../models/user');


const jwt = require('jsonwebtoken');
const _ = require('lodash');

router.post('/in', async (req, res, next) => {
    try {
        let token = createJWToken({
            sessionData: req.body,
            maxAge: 3600
        });
        let user = await User.findOne(req.body);
        if (user === null) {
            user = new User(req.body);
            await user.save();
            user = {...user._doc, new: true, token};
        }
        res.status(200).send({user});
    } catch (err) {
        console.log(err);
        res.status(403).send(err);
        return next(err);
    }
});
router.post('/out', async (req, res, next) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        let u = await user.save();
        res.status(200).send({_id: u._id, name: u.name});
    } catch (err) {
        res.status(500).send(err);
        next(err);
    }
});
module.exports = router;


function createJWToken(details) {
    if (typeof details !== 'object') {
        details = {};
    }

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600;
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val;
        }
        return memo
    }, {});

    return jwt.sign({
        data: details.sessionData
    }, 'secret', {
        expiresIn: details.maxAge,
        algorithm: 'HS256'
    });
}

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        })
    })
}

function verifyJWT_MW(req, res, next) {
    let token = (req.method === 'POST') ? req.body.token : req.query.token;

    verifyJWTToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.data;
            next()
        })
        .catch((err) => {
            res.status(400)
                .json({message: "Invalid auth token provided."})
        })
}