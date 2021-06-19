const Sequelize = require('sequelize');
const connection = require('../../services/sequelize.service').connection();



const User_Room = connection.define('User_Room', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    solved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}
);
module.exports = User_Room;