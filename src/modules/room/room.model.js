const connection = require('../../services/sequelize.service').connection();
const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const Config = require('../../environments/index');
const Room_Question = require('../throughTables/Room_Question.model');
const User_Room = require('../throughTables/User_Room.model');
const User = require('../user/user.model');
const Question = require('../question/question.model');

//Sequelize ORM user design
const Room = connection.define('Room', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        scoreA: {
            type: INTEGER,
            defaultValue: 0
        },
        scoreB: {
            type: INTEGER,
            defaultValue: 0
        }
    }
);
module.exports = Room;

oTm(Room, User)

function oTm(A, B) {
    A.hasMany(B);
    B.belongsTo(A);
}


function oTm(A, B, as) {
    A.hasMany(B, {as: as});
    B.belongsTo(A, {as: as});
}

function oTm(A, B, fk, as) {
    A.hasMany(B, {foreignKey: fk, as: as});
    B.belongsTo(A, {foreignKey: fk, as: as});
}

mTm(Room, Question, Room_Question)
mTm(User, Room_Question, User_Room)
function mTm(A, B, through) {
    A.belongsToMany(B, {through: through});
    B.belongsToMany(A, {through: through});
}

function mTm(A, B, through, as) {
    A.belongsToMany(B, {through: through, as: as});
    B.belongsToMany(A, {through: through, as: as});
}

