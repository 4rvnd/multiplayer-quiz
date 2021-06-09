const sequelize = require('sequelize');

const { Op } = require("sequelize");

const bcrypt = require('bcrypt');
const Config = require('../../environments/index');
const Auth = require('../../services/auth.service');
const Question = require('./question.model');
async function create(req) {
    const _b = req.body;
    try {
        if (!_b.question || !_b.answer) {
            throw new Error("Question and Answer cannot be null");
        } else {
            let case1 = await Question.findOne({
                where: {
                    question: _b.question
                }
            })
            if (case1) {
                return {
                    code: 400,
                    data: {
                        status: false,
                        message: "Question already exists"
                    }
                }
            } else {
                data = await Question.create({
                    question: _b.question,
                    answer: _b.answer
                })
                return {
                    code: 200,
                    data: {
                        status: true,
                        data: data
                    }
                }
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

async function get(req) {
    const _q = req.query;
    try {
        const opts = { where: {} };
        if (_q.QuestionId) {
            opts.where.id = _q.QuestionId;
            let data = await Question.findOne(opts)
            if (!data) {
                return {
                    code: 400,
                    data: {
                        status: false,
                        message: 'No question found'
                    }
                }
            } else {
                return {
                    code: 200,
                    data: {
                        status: true,
                        data: data
                    }
                }
            }
        }

        let u = await Question.findAll(opts)
        if (!u) {
            return {
                code: 400,
                data: {
                    status: false,
                    message: 'No question found'
                }
            }
        } else {
            return {
                code: 200,
                data: {
                    status: true,
                    data: u
                }
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            code: 400,
            data: { status: false, message: err.message }
        }
    }
};


async function getRandom(req) {
    const _q = req.query;
    try {
        const opts = { where: {}, order: sequelize.literal('rand()'), limit: 5 };

        let u = await Question.findAll(opts)
        if (!u) {
            return {
                code: 400,
                data: {
                    status: false,
                    message: 'No question found'
                }
            }
        } else {
            return {
                code: 200,
                data: {
                    status: true,
                    data: u
                }
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            code: 400,
            data: { status: false, message: err.message }
        }
    }
};


async function update(req) {
    const _b = req.body;
    try {
        let case1 = await Question.findOne({
            where: {
                id: _b.QuestionId
            }
        })
        if (case1) {
            let u = await Question.update({
                question: _b.question,
                answer: _b.answer
            }, {
                where: {
                    id: _b.QuestionId,
                }
            })
            return {
                code: 200,
                data: { ...u.dataValues, status: true }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    status: false,
                    message: 'No question found'
                }
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            code: 400,
            data: { status: true, message: err.message }
        }
    }
}

async function del(req) {
    const _b = req.body;
    try {
        if(!_b.QuestionId) {
            throw new Error("Need QuestionId");
        } 
        else {
            let data = await Question.destroy({ where: { id: _b.QuestionId } })
            if(data) {
                return {
                    code: 200,
                    data: {
                        status: true,
                        message: "Deleted"
                    }
                }
            }
            else{
                return {
                    code: 400,
                    data: {
                        status: false,
                        message: "Cannot Delete"
                    }
                }
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            code: 400,
            data: { status: true, message: err.message }
        }
    }
}

exports.create = create;
exports.get = get;
exports.getRandom = getRandom;
exports.update = update;
exports.delete = del;