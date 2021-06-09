exports.get = function (req, res, next) {
    res.render('index', { title: 'Multiplayer Quiz Application' });
}

const user_room = require("../modules/throughTables/User_Room.handler")
const user = require("../modules/user/user.handler")

exports.getMergedTable = async (req, res) => {
    let ret = await user.removeRoom(req)
    res.status(ret.code).send(ret.data)
}