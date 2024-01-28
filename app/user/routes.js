const express = require('express');
const router = express.Router();
const upload = require('../../config/multerUserConfig');
const { 
    updatePhoto,
    editUser,
    editEmail,
    getUser,
    getInfoAboutMe,
} = require('./controllers')
const {} = require('./middlewares')
const passport = require('passport');

router.post('/api/user/updatePhoto', passport.authenticate('jwt', {session: false}), upload.single('avatar'), updatePhoto)
router.post('/api/user/edit', passport.authenticate('jwt', {session: false}), editUser)
router.post('/api/user/editEmail', passport.authenticate('jwt', {session: false}), editEmail)
router.get('/api/user/:username', getUser)
router.post('/api/profile', passport.authenticate('jwt', {session: false}), getInfoAboutMe)
module.exports = router