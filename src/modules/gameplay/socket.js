const io = require("../../../bin/www")

const RoomHandler = require('../room/room.handler')
const UserHandler = require('../user/user.handler')
const QuestionHandler = require('../question/question.handler')
const moment = require('moment');
const Room_Question = require("../throughTables/Room_Question.handler");
const User_Room = require("../throughTables/User_Room.handler");
const User = require("../user/user.handler");
var questions;
var tick = 0;
var timeout;
function formatMessage(message, text) {
  return {
    message,
    text,
    time: moment().format('h:mm a')
  };
}


async function getUserDetails(UserId) {
    var q = {query: {}};
    q.query.UserId = UserId;
    let data = await UserHandler.get(q)
    if(data.code == 400) return null;
    data = {...data.data.data.dataValues};
    return data.userName;
}

async function getQuestions() {
    var q = {query: {}};
    let data = await QuestionHandler.getRandom(q)
    if(data.code == 400) return null;
    data = data.data.data;
    data = data.map(elem => {
        return {...elem.dataValues}
    })
    return data;
}

async function addToStat(QuestionId, RoomId) {
    var q = {query: {}}
    q.query.RoomId = RoomId
    q.query.QuestionId = QuestionId
    let data = await Room_Question.add(q)
    return data;
}

var i = 0;
async function sendQuestions(questions, RoomId) {
    try{
        io
        .to(RoomId)
        .emit(
            'message',
            formatMessage(`${questions[i]?.question}`)
        );
        let data = addToStat(questions[i].id, RoomId)
        console.log(questions[i])
        i++;
        return questions;
        
    }
    catch(err) {
        console.log(err)
    }
}

async function getScore(RoomId) {
    let data = await User_Room.getMergedTable(RoomId)
    return data;
}
async function finalize(RoomId) {
    var q = {query: {}}
    q.query.RoomId = RoomId
    let score = await getScore(q);
    console.log(score?.data?.data)
    score = score?.data?.data
    var user1 = score[0]
    var user2 = score[1]
    io
    .to(RoomId)
    .emit(
        'message',
        formatMessage(`Game Ended, Your Scores: ${user1.name} got ${user1.score} & ${user2.name} got ${user2.score}`)
    );
    if(user1.score == user2.score) {
        io
        .to(RoomId)
        .emit(
            'message',
            formatMessage(`Both users got same score`)
        );
    }
    else{
        var won = user1.score>user2.score ? user1 : user2;
        io
        .to(RoomId)
        .emit(
            'message',
            formatMessage(`${won.name} won the match`)
        );
    }

    //add disconnect logic
    q = {query: {}}
    q.query.RoomId = RoomId;
    await User.removeRoom(q);
}   

async function interval(RoomId) {
    try{
        tick = 10000;
        await sendQuestions(questions, RoomId);
        if(i>4) {
            clearInterval(timeout);
            timeout = setTimeout(function() { finalize(RoomId) }, 10000)
        }
        else{
            clearInterval(timeout);
            timeout = setInterval(function () { interval(RoomId) }, tick)
        }
    }
    catch(err) {
        console.log(err)
    }
}

exports.init = async ()=>{
    io.on('connection', (socket) => {
        console.log('user connected');
        
        var tick = 10000;

        socket.on('join', async(RoomId, UserId) => {
            i=0;
            tick = 0;
            let b = {body: {}}
            b.body.RoomId = RoomId;
            b.body.UserId = UserId;
            let data = await RoomHandler.addUser(b);
            if(data.code != 400) {
                const user = await getUserDetails(UserId);
                socket.join(RoomId);
                socket.emit('message', formatMessage('Welcome to Game!'));
                io
                .to(RoomId)
                .emit(
                    'message',
                    formatMessage(`${user} has joined the game in room ${RoomId}, has UserId set as ${UserId}`)
                );
                questions = await getQuestions();
            }
            else{
                console.log("User already in another room")
            }
        })

        socket.on('start', async (RoomId) => {
            timeout = setInterval(function () { interval(RoomId) }, tick)            
        })

        socket.on('ans', async(ans, UserId, RoomId, QuestionId) => {
            var q = {query: {}}
            q.query.RoomId = RoomId;
            q.query.QuestionId = QuestionId;

            //Get Room Question through table data
            let data = await Room_Question.getOne(q)
            data = {...data?.data?.data?.dataValues}

            var b = {query: {}}
            b.query.RoomQuestionId = data.id

            //Get Room User through table count(RoomQuestionId) 
            var u1 = await User_Room.getCount(b);
            u1 = u1?.data?.data
            if(u1>=2 && i<=4) {}
            else{
                b.query.UserId = UserId
                //Get Room User through table count(RoomQuestionId && UserId)
                var u2 = await User_Room.getCount(b);
                u2 = u2?.data?.data
                console.log(u2)
                const opts = { query: {} };
                opts.query.QuestionId = QuestionId;
                let data1 = await QuestionHandler.get(opts)
                if(data1.code == 400) {}
                else{
                    data1 = {...data1?.data?.data?.dataValues};
                    if(ans == data1.answer) {
                        var sol = true
                    }
                    else {
                        var sol = false
                    }
                }
                var q1 = {query: {}}
                q1.query.UserId = UserId;
                q1.query.RoomQuestionId = data.id;
                q1.query.solved = sol;
                data = await User_Room.add(q1);
                if(u2 == 1 && i<=4) {
                    tick = 0;
                    clearInterval(timeout);
                    timeout = setInterval(function () { interval(RoomId) }, tick)
                }
            }
        })

        socket.on('end', async (RoomId) => {
            socket.leave(RoomId);
        })
    })

    io.engine.on("connection_error", (err) => {
        console.log(err.req);	     // the request object
        console.log(err.code);     // the error code, for example 1
        console.log(err.message);  // the error message, for example "Session ID unknown"
        console.log(err.context);  // some additional error context
      });
}