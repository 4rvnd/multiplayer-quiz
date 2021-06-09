const sequelize = require('sequelize');

const { Op } = require("sequelize");
// const Room = require('./room.model');
const Room_Question = require('./Room_Question.model');

async function add(req) {
    const _q = req.query;
    try {
        let data = await Room_Question.create({
            RoomId: _q.RoomId,
            QuestionId: _q.QuestionId,
            // solved: _q.solved
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
        // const opts = { where: {} };
        // if (_q.RoomId) opts.where.RoomId = _q.RoomId;
        // if (_q.QuestionId) opts.where.QuestionId = _q.QuestionId;
        // console.log(opts)
        let data = await Room_Question.findOne({
            where: {
                RoomId: _q.RoomId,
                QuestionId: _q.QuestionId
            }
        })
        // console.log(data)

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

exports.add = add;
exports.getOne = getOne;