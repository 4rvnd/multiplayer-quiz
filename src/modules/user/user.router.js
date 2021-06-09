const router = require('express').Router();
const passport = require('passport');

const Controller = require('./user.controller');
const UserGuard = passport.authenticate('user', {session: false});

router.post('/login', Controller.login);
router.post('/register', Controller.register);

router.route('/')
    .get(Controller.get)
    .put(UserGuard, Controller.update)
    .delete(UserGuard, Controller.delete)

module.exports = router;
