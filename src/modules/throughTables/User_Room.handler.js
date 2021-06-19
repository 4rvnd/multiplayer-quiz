const sequelize = require('sequelize');

const { Op } = require("sequelize");
const User = require('../user/user.model');
const User_Room = require('./User_Room.model');
const Room_Question = require('./Room_Question.model');

async function add(req) {
    const _q = req.query;
    try {
        let data = await User_Room.create({
            RoomQuestionId: _q.RoomQuestionId,
            UserId: _q.UserId,
            solved: _q.solved
        })
        return {
            code: 200,
            data: {
                status: true,
                data: data
            }
        }
    }
    catch (err) {
        // console.error(err);
        return {
            code: 400,
            data: {
                status: false,
                message: err.message
            }
        }
    }
};

async function getOne(req) {
    const _q = req.query;
    try {
        const opts = { where: {} };
        if (_q.RoomId) opts.where.RoomId = _q.RoomId;
        if (_q.QuestionId) opts.where.QuestionId = _q.QuestionId;
        let data = await User_Room.findOne({opts})
        return {
            code: 200,
            data: {
                status: true,
                data: data
            }
        }
    }
    catch (err) {
        console.error(err);
        return {
            code: 400,
            data: {
                status: false,
                message: err.message
            }
        }
    }
};

async function getCount(req) {
    const _q = req.query;
    try {
        const opts = { where: {} };
        if (_q.RoomQuestionId) opts.where.RoomQuestionId = _q.RoomQuestionId;
        let data = await User_Room.count(opts)
        return {
            code: 200,
            data: {
                status: true,
                data: data
            }
        }
    }
    catch (err) {
        console.error(err);
        return {
            code: 400,
            data: {
                status: false,
                message: err.message
            }
        }
    }
};


async function getMergedTable(req) {
    const _q = req.query;
    try {
        const opts = { 
            where: {},
            include: [{
                model: Room_Question,
                where: {
                    RoomId: _q.RoomId
                },
                required: true,
            }
        ]
        };
        // if (_q.RoomQuestionId) opts.where.RoomQuestionId = _q.RoomQuestionId;
        let data = await User.findAll(opts)

        var user = data.map(entity => {
            var a = {}
            var score = 0;
            a.name = entity.userName
            entity.Room_Questions.map(data => {
                if (data.User_Room.solved == true){
                    score+= 10
                }

            })
            a.score = score
            return a;
        })
        return {
            code: 200,
            data: {
                status: true,
                data: user
            }
        }
    }
    catch (err) {
        console.error(err);
        return {
            code: 400,
            data: {
                status: false,
                message: err.message
            }
        }
    }
};


exports.add = add;
exports.getOne = getOne;
exports.getCount = getCount;
exports.getMergedTable = getMergedTable;