const Sequelize = require('sequelize');
const connection = require('../../services/sequelize.service').connection();



const Room_Question = connection.define('Room_Question', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    // solved: {
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false
    // }
}
);
module.exports = Room_Question;