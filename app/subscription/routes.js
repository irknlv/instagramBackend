const express = require('express');
const router = express.Router();
const {
    subscribeTo,
    unSubscribeFrom,
    getFollowers,
    getProfiles,
} = require('./controllers')

const passport = require('passport');

router.post('/api/subscribe', passport.authenticate('jwt', {session: false}), subscribeTo);
router.delete('/api/subscribe', passport.authenticate('jwt', {session: false}), unSubscribeFrom);
router.get('/api/followers/:username', getFollowers)
router.get('/api/profiles/:username', getProfiles)

module.exports = router;