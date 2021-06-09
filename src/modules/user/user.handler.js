const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Config = require('../../environments/index');
const Auth = require('../../services/auth.service');
const User = require('./user.model');
async function register(req) {
    const _b = req.body;
    try {
        if (!_b.password) {
            throw new Error("Password cannot be null");
        } else if (!_b.email) {
            throw new Error("email cannot be null");
        } else {
            let u = await User.findOne({
                where: {
                    email: _b.email
                },
                attributes: ['id']
            })
            if (u) {
                return {
                    code: 400,
                    data: {
                        status: false,
                        message: "Email already registered"
                    }
                }
            } else {
                data = await User.create({
                    email: _b.email,
                    password: bcrypt.hashSync(_b.password, 0),
                    userName: _b.userName,
                    firstName: _b.firstName,
                    lastName: _b.lastName,
                    mobileNumber: _b.mobileNumber
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

async function login(req) {
    const _b = req.body;
    try {
        if (!_b.email) {
            throw new Error("Email cannot be null");
        } else if (!_b.password) {
            throw new Error("Password cannot be null");
        } else {
            const user = await User.findOne({ where: { email: _b.email } });
            if (!user) {
                throw new Error('data not found');
            } else if (!bcrypt.compareSync(_b.password, user.password)) {
                throw new Error('Wrong Password');
            } else {
                const updatedUser = await User.findOne({ where: { id: user.id } });
                const auth = Auth.encode(user.id);
                return {
                    code: 200,
                    data: { status: true, ...{ ...(updatedUser.dataValues), auth: auth } }
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
};

async function get(req) {
    const _q = req.query;
    try {
        const opts = { where: {} };
        if (_q.UserId) {
            opts.where.id = _q.UserId;
            let u = await User.findOne(opts)
            if (!u) {
                return {
                    code: 400,
                    data: {
                        status: false,
                        message: 'user not found'
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

        let u = await User.findAll(opts)
        if (!u) {
            return {
                code: 400,
                data: {
                    status: false,
                    message: 'user not found'
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
            data: { status: true, message: err.message }
        }
    }
};

async function update(req) {
    const _b = req.body;
    try {
        let u = await User.update({
            userName: _b.userName,
            firstName: _b.firstName,
            lastName: _b.lastName,
            mobileNumber: _b.mobileNumber,
        }, {
            where: {
                id: req.user.id,
            }
        })
        return {
            code: 200,
            data: { ...u.dataValues, status: true }
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
        if(!_b.UserId) {
            throw new Error("Need UserId");
        } 
        else {
            let data = await User.destroy({ where: { id: req.user.dataValues.id } })
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

async function removeRoom(req) {
    const _q = req.query;
    try {
        let u = await User.findAll({
            where: {
                RoomId: _q.RoomId
            }
        })
        for(i=0; i<2; ++i) {
            try{
                let data = await User.update({
                    RoomId: null
                }, {
                    where: {
                        id: u[i].id,
                    }
                })
            }
            catch(err) {
                // console.log(err)
            }
            
        }
        return {
            code: 200,
            data: { data: u, status: true }
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

async function countUsers(req) {
    const _q = req.query;
    try {
        let count = await User.count({
            where: {
                RoomId: _q.RoomId
            }
        })
        return count;
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

exports.register = register;
exports.login = login;
exports.get = get;
exports.update = update;
exports.delete = del;
exports.removeRoom = removeRoom;
exports.countUsers = countUsers;