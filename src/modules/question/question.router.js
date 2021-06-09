const router = require('express').Router();
const passport = require('passport');

const Controller = require('./question.controller');
const UserGuard = passport.authenticate('user', {session: false});

router.get('/random', Controller.getRandom);
router.route('/')
    .get(Controller.get)
    .post(Controller.create)
    .put(Controller.update)
    .delete(Controller.delete)

module.exports = router;
