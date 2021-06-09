const handler = require("./room.handler")

exports.get = async (req, res) => {
    let ret = await handler.get(req)
    res.status(ret.code).send(ret.data)
};

exports.create = async (req, res) => {
    let ret = await handler.create(req)
    res.status(ret.code).send(ret.data)
};

exports.update = async (req, res) => {
    let ret = await handler.update(req)
    res.status(ret.code).send(ret.data)
};
exports.delete = async (req, res) => {
    let ret = await handler.delete(req)
    res.status(ret.code).send(ret.data)
};
