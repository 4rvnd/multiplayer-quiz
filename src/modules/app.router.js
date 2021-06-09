const express = require('express');
const router = express.Router();
const passport = require('passport');
const Controller = require('./app.controller');


/* GET home page. */
router.route('/').get(Controller.get);
router.use('/user', require('./user/user.router'));
router.use('/room', require('./room/room.router'));
router.use('/question', require('./question/question.router'));
router.get('/getMergedTable', Controller.getMergedTable);
module.exports = router;
