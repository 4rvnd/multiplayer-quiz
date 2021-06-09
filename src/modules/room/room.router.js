const router = require('express').Router();
const passport = require('passport');

const Controller = require('./room.controller');
const UserGuard = passport.authenticate('user', {session: false});


router.route('/')
    .get(Controller.get)
    .post(UserGuard, Controller.create)
    .put(UserGuard, Controller.update)
    .delete(UserGuard, Controller.delete)

module.exports = router;
