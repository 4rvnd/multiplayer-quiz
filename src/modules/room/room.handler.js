const sequelize = require('sequelize');

const { Op } = require("sequelize");

const bcrypt = require('bcrypt');
const Config = require('../../environments/index');
const Auth = require('../../services/auth.service');
const Room = require('./room.model');
const User = require('../user/user.model');

async function create(req) {
    const _b = req.body;
    try {
        let data = await Room.create({
            userA: _b.userA
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

async function addUser(req) {
    const _b = req.body;
    try {
        let count = await User.count({
            where: {
                RoomId: _b.RoomId
            }
        })
        if(count>=2) {
            return {
                code: 400,
                data: {
                    status: false,
                    data: "Already 2 players in the room"
                }
            }
        }
        let user = await User.findOne({
            where: {
                id: _b.UserId
            }
        })
        user = {...user?.dataValues}
        if(user.RoomId != null) {
            return{
                code: 400,
                data: {
                    status: false,
                    message: "User already connected to another room"
                }
            }
        }
        else{
            let data = User.update({
                RoomId: _b.RoomId
            }, {
                where: {
                    id: _b.UserId
                }
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


async function removeUser(req) {
    const _b = req.body;
    try {
        let data = User.update({
            RoomId: null
        },{
            where: {
                id: _b.UserId,
            }
        })
        return{
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

async function get(req) {
    const _q = req.query;
    try {
        const opts = { where: {} };
        if (_q.RoomId) opts.where.id = _q.RoomId;
        // else opts.where = {
        //     [Op.or]: [
        //         {
        //             userA:
        //             {
        //                 [Op.eq]: null
        //             }
        //         }, 
        //         {
        //             userB:
        //             {
        //                 [Op.eq]: null
        //             }
        //         }
        //     ]
        // }
        // if(_q.RoomId) {
        //     let u = await Room.findOne(opts)
        //     if (!u) {
        //         return {
        //             code: 400,
        //             data: {
        //                 status: false,
        //                 message: 'room not found'
        //             }
        //         }
        //     } else {
        //         return {
        //             code: 200,
        //             data: {
        //                 status: true,
        //                 data: u
        //             }
        //         }
        //     }
        // }
        let u = await Room.findAll(opts)
        if (!u) {
            return {
                code: 400,
                data: {
                    status: false,
                    message: 'room not found'
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

// async function update(req) {
//     const _b = req.body;
//     try {
//         let case1 = await Room.findOne({
//             where: {
//                 userA: _b.userB
//             }
//         })
//         let case2 = await Room.findOne({
//             where: {
//                 userB: _b.userB
//             }
//         })
//         if (case1 || case2) {
//             return {
//                 code: 400,
//                 data: {
//                     status: false,
//                     message: "User already exists in a room"
//                 }
//             }
//         }
//         else{
//             let u = await Room.update({
//                 userB: _b.userB
//             }, {
//                 where: {
//                     id: _b.RoomId,
//                 }
//             })
//             return {
//                 code: 200,
//                 data: { ...u.dataValues, status: true }
//             }
//         }
//     }
//     catch (err) {
//         console.log(err)
//         return {
//             code: 400,
//             data: { status: true, message: err.message }
//         }
//     }
// }


async function addScore(req) {
    const _q = req.query;
    try {
        let case1 = await Room.findOne({
            where: {
                id: _q.RoomId
            }
        })
        
        if (!case1) {
            return {
                code: 400,
                data: {
                    status: false,
                    message: "User already exists in a room"
                }
            }
        }
        else{
            case1 = {...case1.dataValues};
            let opts = {scoreA: {}, scoreB: {}};
            if(case1.userA == _q.UserId) {
                opts.scoreA = sequelize.literal('scoreA + 10');
                opts.scoreB = sequelize.literal('scoreB');
            }
            else if(case1.userB == _q.UserId) {
                opts.scoreB = sequelize.literal('scoreB + 10');
                opts.scoreA = sequelize.literal('scoreA');
            }
            let u = await Room.update(opts, {
                where: {
                    id: _q.RoomId,
                }
            })
            return {
                code: 200,
                data: { ...u.dataValues, status: true }
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
        if(!_b.RoomId) {
            throw new Error("Need RoomId");
        } 
        else {
            let data = await Room.destroy({ where: { id: _b.RoomId } })
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
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.delete = del;
// exports.addScore = addScore;