// Setting up Socketio server
//list of functions and their purpose
// joinRoom - join a room (will emit roomFull if room is full) //TODO : add a check for roomFull on client side
// TODO localhost:5174 will be the react project for scoreboard!
// requestNumbers - request for numbers to be generated (receive target length from client if none provided will be 5 numbers)
// startGame will be call when room has 2 users and firstPlayerName will be emited //TODO : startGame on client based on firstPlayer
// Users stats will be stored in stats //TODO
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

app.use(cors());
const { Server } = require('socket.io');
const { exit } = require('process');

const server = http.createServer(app);

const io = new Server(server, {
  // cors set up for react
  cors: {
    origin: ['https://iq-180.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const operators = ['+', '-', '*', '/'];

// shuffle numbers array order
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

// gen nums according to pemdas
function genNumbers(targetLength){
  let numbers = [];
  let result = 0;
  let count =0;
  let ops = [];
  for (let i = 0; i < targetLength; i++) {
    numbers.push(Math.floor(Math.random() * 9)+1);
  }
  while(!Number.isInteger(result) || result<1 || result>500){
    //reset result
    result = 0;
    ops = [];
    // if the loop runs more than 200 times, reset the numbers
    if(count++>200){
      numbers =[];
      for (let i = 0; i < targetLength; i++) {
      numbers.push(Math.floor(Math.random() * 9)+1);
      }
      count = 0;
    }
    //randomly select operators
    for(let i=0; i<targetLength-1; i++){
      ops.push(operators[Math.floor(Math.random()*4)]);
    }
    let equation = "";
    for (let i=0;i<numbers.length;i++) {
      equation+=numbers[i];
      if (i!==numbers.length-1) {
        equation+=ops[i];
      }
    }
    result = eval(equation);
  }
  console.log(`answer are: ${numbers} ${ops}`);
  shuffle(numbers);
  return { numbers, result };
}

//gen nums according to lefttoright
function getNumbersLeftToRight(targetLength){
  let numbers = [];
  let result = 0;
  let count =0;
  let ops = [];
  for (let i = 0; i < targetLength; i++) {
    numbers.push(Math.floor(Math.random() * 9)+1);
  }
  while(!Number.isInteger(result) || result<1 || result>500){
    //reset result
    result = 0;
    ops = [];
    // if the loop runs more than 200 times, reset the numbers
    if(count++>200){
      numbers =[];
      for (let i = 0; i < targetLength; i++) {
      numbers.push(Math.floor(Math.random() * 9)+1);
      }
      count = 0;
    }
    //randomly select operators
    for(let i=0; i<targetLength-1; i++){
      ops.push(operators[Math.floor(Math.random()*4)]);
    }
    let equation = "";
    for (let i=0;i<numbers.length;i++) {
      equation+=numbers[i];
      if (i!==numbers.length-1) {
        equation+=ops[i];
      }
    }
    result = eval(equation);
  }
  console.log(`answer are: ${numbers} ${ops}`);
  return { numbers, result };
}

let stats = {};
// let keys = {"Room 1":{timeCalled:0,numbers:[],ans:null,turn:null,users:[],response:{correctness:null,timeUsed:null},targetLength:5},"Room 2":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],response:{correctness:null,timeUsed:null},targetLength:5},"Room 3":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],response:{correctness:null,timeUsed:null}},targetLength:5};
let keys = {};
let connections = {};

io.on('connection', (socket) => {
  connections[socket.id] = {room:null};
  console.log(`A user with id: ${socket.id} connected`);

  socket.on('requestNumbers', () => {
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    if (keys[room].turn === socket.nickname) {
      let numbers;
      let targetResult;
      // Check whether if the numbers are already generated or not.
      if (keys[room].timeCalled === 0) {
        // generate numbers according to pemdas or left to right
        const returnVaules = keys[room].orderofoperations==="pemdas" ? genNumbers(keys[room].targetLength) : getNumbersLeftToRight(keys[room].targetLength);
        numbers = returnVaules.numbers;
        targetResult = returnVaules.result;
        keys[room].timeCalled = 1;
        keys[room].numbers = numbers;
        keys[room].ans = targetResult;
      }
      else if(keys[room].timeCalled === 1){
        keys[room].timeCalled += 1;
        numbers = keys[room].numbers;
        targetResult = keys[room].ans;
      }
      else{
        // generate numbers according to pemdas or left to right
        const returnVaules = keys[room].checkingLefttoright? getNumbersLeftToRight(keys[room].targetLength) : genNumbers(keys[room].targetLength);
        numbers = returnVaules.numbers;
        targetResult = returnVaules.result;
        keys[room].timeCalled = 1;
        keys[room].numbers = numbers;
        keys[room].ans = targetResult;
      }
      // Only emit the numbers to the requested client ensuring that the numbers are not leaked to other clients!
      socket.emit('numbers', { numbers, targetResult });
      console.dir(keys);
    }
    else{
      socket.emit('message', 'It is not your turn!');
      console.log('\x1b[31m',`WARNING: ${socket.nickname} tried to call for numbers but it is not ${socket.nickname}'s turn!! `,'\x1b[0m');
    }
  });

  socket.on('joinRoom', ({ room, name }) => {
    // Check if room exists
    if(keys[room] === undefined){
      keys[room] = { timeCalled:0,numbers:[],ans:null,turn:null, users:[], id:[],response:{correctness:null,timeUsed:null},targetLength:5,orderofoperations:"pemdas", users_ready:0, attempt:1 };
    }
    // Check if room is full
    if(io.sockets.adapter.rooms.get(room)?.size === 2) {
      socket.emit('roomFull', 'Room is full');
      return;
    }
    // Added joinRoomSuccess event to notify the client that the room has been joined successfully
    connections[socket.id].room = room;
    connections[socket.id].nickname = name;
    socket.emit('joinRoomSuccess', `Room joined successfully`);
    //Set nickname
    socket.nickname = name;
    //setting up the scoreboard
    if (!(room in stats)) {
      stats[socket.id] = {};
    }
    stats[socket.id] = {nickname: name, score:0 };
    socket.join(room);
    keys[room].users.push(socket.nickname);
    keys[room].id.push(socket.id);
    console.log('\x1b[32m',`${name} joined ${room}`,'\x1b[0m');
    io.to(room).emit('message', `${name} has joined the room`);
    // if(io.sockets.adapter.rooms.get(room)?.size === 2) {
    //   const roomSocket = io.sockets.adapter.rooms.get(room);
    //   const nicknames = [];
    //   roomSocket.forEach(socketId => {
    //     const socket = io.sockets.sockets.get(socketId);
    //     if (socket && socket.nickname) {
    //       nicknames.push(socket.nickname);
    //     }
    //   });
    //   const firstPlayer = (Math.random()>0.5)? nicknames[1]:nicknames[0];
    //   keys[room].turn = firstPlayer;
    //   console.log(`${firstPlayer} will start the game`);
    //   io.to(room).emit('startGame',firstPlayer);
    // }
    // the player will be the one who set options. Preventing confilct.
    socket.emit('getReady');
  });

  socket.on('playerReady', () => {
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    keys[room].users_ready += 1;
    if(keys[room].users_ready === 2 && io.sockets.adapter.rooms.get(room)?.size === 2){
      const randomPlayer = Math.floor(Math.random()*1);
      keys[room].turn = keys[room].users[randomPlayer];
      console.log(`${keys[room].turn} will start the game`);
      //io.to(room).emit('startGame', {firstPlayer:keys[room].turn, attempt:keys[room].attempt});
      io.to(room).emit('startGame', {turn:keys[room].turn, targetLength:keys[room].targetLength, attempt:keys[room].attempt, orderofoperations:keys[room].orderofoperations});
    }
  });

  // Sending current options to the client
  socket.on('getOption',()=>{
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    socket.emit('options',{targetLength:keys[room].targetLength, attempt:keys[room].attempt, orderofoperations:keys[room].orderofoperations});
  });

  // Set options (targetLength, attempt, check_leftToRight)
  socket.on('setOptions', ({targetLength, attempt , orderofoperations}) => {
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    keys[room].targetLength = targetLength;
    keys[room].orderofoperations = orderofoperations;
    //check if attempt is an integer prevent from setting it to a string and noninteger
    console.log(attempt);
    if(attempt !== null){attempt = parseInt(attempt);} else{attempt = 1;}
    keys[room].attempt = attempt;
    io.to(room).emit('optionsSet', `Options set successfully`);
  });

  // Checking the answer Pemdas
  function check_pemdas(nums, operators){
    let equation = "";
          for (let i=0;i<nums.length;i++) {
              equation+=nums[i];
              if (i!==nums.length-1) {
                  equation+=operators[i];
              }
          }
        let playerAnswer = eval(equation);
        return playerAnswer;
  }

  // Checking the answer from left to right
  function check_leftToRight(nums, operators){
    let playerAnswer = 0;
    for(let i = 0; i<nums.length;i++){
      if(i !== operators.length){
        switch(operators[i]){
          case '+':
            playerAnswer += nums[i];
            break;
          case '-':
            playerAnswer -= nums[i];
            break;
          case '*':
            playerAnswer *= nums[i];
            break;
          case '/':
            playerAnswer /= nums[i];
            break;
          default:
            throw new Error('Invalid operator');
        }
      }
    }
    return playerAnswer;
  }

  //TODO 
  socket.on('checkAns', ({nums, operators, timeUsed, room, attemptleft, timeOut})=>{
    // if nums and operators are valids.
    let nums_check = nums.filter((value) => value !== null);
    let operators_check = operators.filter((value) => value !== null);
    let booleanResult;
    if(nums_check.length === keys[room].targetLength && operators_check.length === (keys[room].targetLength-1) ){ 
      try {
        playerAnswer = keys[room].checkingLefttoright? check_leftToRight(nums, operators) : check_pemdas(nums, operators);
        booleanResult = playerAnswer === keys[room].ans;
      } catch (error) {
        io.to(room).emit('error', { message: error.message });
      }}
      // handleTimeout!
      else if(timeOut === true){
        booleanResult = false;
      }
      else{
        // Invalid numbers or invalid operators
        booleanResult = false;
      }
        // Implementation of answer checking
        if(keys[room].timeCalled ===2){
            if(booleanResult){// // Show turnEnd page
            // io.to(room).emit('turnEnd');
            // Both players have answered correctly
            if(booleanResult && keys[room].response.correctness){
              if(timeUsed<keys[room].response.timeUsed){
                // reset the response
                keys[room].response.correctness = null;
                keys[room].response.timeUsed = null;
                // Second Player wins
                stats[socket.id].score += 1;
                io.to(room).emit('updateScore', {
                  [socket.nickname]: stats[socket.id].score,
                  [keys[room].users.filter(user => user !== socket.nickname)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                keys[room].turn = socket.nickname;
                // Start next game? Second player will start
                io.to(room).emit('swapTurn',keys[room].turn);
              }
              else if( timeUsed === keys[room].response.timeUsed ){
                // reset the response
                keys[room].response.correctness = null;
                keys[room].response.timeUsed = null;
                // Draw both players get score
                stats[socket.id].score += 1;
                stats[keys[room].id.filter(user => user !== socket.id)[0]].score += 1;
                io.to(room).emit('updateScore',{
                  [socket.nickname]: stats[socket.id].score,
                  [keys[room].users.filter(user => user !== socket.nickname)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                // Randomly select the first player
                const firstPlayer = (Math.random()>0.5)? keys[room].users[1]:keys[room].users[0];
                keys[room].turn = firstPlayer;
                // Start next game? 
                io.to(room).emit('swapTurn',keys[room].turn);
              }
              else{
                // reset the response
                keys[room].response.correctness = null;
                keys[room].response.timeUsed = null;
                // First Player wins
                stats[keys[room].id.filter(user => user !== socket.id)[0]].score += 1;
                // Update the score on the client side
                io.to(room).emit('updateScore',{
                  [socket.nickname]: stats[socket.id].score,
                  [keys[room].users.filter(user => user !== socket.nickname)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                keys[room].turn = keys[room].users.filter(user => user !== socket.nickname)[0];
                // Start next game? First player will start
                io.to(room).emit('swapTurn',keys[room].turn);
              }
            }
            // Only the first player has answered correctly
            else if(keys[room].response.correctness){
              // reset the response
              keys[room].response.correctness = null;
              keys[room].response.timeUsed = null;
              // First Player wins
              stats[keys[room].id.filter(user => user !== socket.id)[0]] += 1;
              // Update the score on the client side
              io.to(room).emit('updateScore',{
                [socket.nickname]: stats[socket.id].score,
                [keys[room].users.filter(user => user !== socket.nickname)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
              });
              keys[room].turn = keys[room].users.filter(user => user !== socket.nickname)[0];
              // Start next game? First player will start
              io.to(room).emit('swapTurn',keys[room].turn);
            }
            // Only Second Player has answered correctly
            else if(booleanResult){
              // reset the response
              keys[room].response.correctness = null;
              keys[room].response.timeUsed = null;
              // Second Player wins
              stats[socket.id].score += 1;
              // Update the score on the client side
              io.to(room).emit('updateScore',{
                [socket.nickname]: stats[socket.id].score,
                [keys[room].users.filter(user => user !== socket.nickname)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
              });
              keys[room].turn = socket.nickname;
              // Start next game? Second player will start
              io.to(room).emit('swapTurn',keys[room].turn);
            }
          }
            else{
              // Second player has answered incorrectly but still has attempts left
              if(!booleanResult && attemptleft > 1){
                // Emit the wrong answer event to the client and return the number of attempts left
                socket.emit('wrongAnswer', attemptleft-1);
                return;
              }
              // Both players have answered incorrectly
              else{
                // reset the response
                keys[room].response.correctness = null;
                keys[room].response.timeUsed = null;
                const firstPlayer = (Math.random()>0.5)? keys[room].users[1]:keys[room].users[0];
                keys[room].turn = firstPlayer;
                // Start next game? Randomly select the first player
                io.to(room).emit('swapTurn',keys[room].turn);
              }
            }
          
        }
        else{
          if(!booleanResult && attemptleft > 1){
            // Emit the wrong answer event to the client and return the number of attempts left
            socket.emit('wrongAnswer', attemptleft-1);
            return;
          }
          // Store the response
          keys[room].response.correctness = booleanResult;
          keys[room].response.timeUsed = timeUsed;
          keys[room].turn = keys[room].users.filter(user => user !== socket.nickname)[0];
          // Emit the result back to the room => show a page 
          io.to(room).emit('swapTurn',keys[room].turn);
        }
        // Update score on the client side
        // Show updated stats  TO BE REMOVED IN THE PRODUCTION
        console.dir(stats);
      
  // Timeup!! or submitted incorrect numbers (nulls) or incorrect operators (nulls)
  // else{
  //   booleanResult = false
  //   keys[room].response.correctness = booleanResult;
  //   keys[room].response.timeUsed = timeUsed;
  //   socket.emit('turnEnd');
  //   io.to(room).emit('swapTurn',keys[room].turn);
  // }
  console.log('\x1b[32m',`Player "${socket.nickname}" submitted the "${booleanResult ? `correct within ${timeUsed}`: "wrong"}" answer`,'\x1b[0m');
  });

  function isUserInRoom(socket) {
    const room = connections[socket.id].room;
    if (!room || !keys[room]) {
      return false;
    }
    return keys[room].id.includes(socket.id);
  }

  function exitRoom(){
    let room = connections[socket.id].room;
    try {
      let users = keys[room].users;
      const userIndex = users.indexOf(socket.nickname);
      if(userIndex !== -1){
        users.splice(userIndex, 1);
      }
      // Emit userDisconnected event to the room
      if(isUserInRoom(socket)){
        io.to(room).emit('userDisconnected', socket.nickname );
        console.log(`User with id: ${socket.id} exited the room`);
      }
      keys[room].users = users;
      keys[room].id = keys[room].id.filter(id => id !== socket.id);
      // Reset the room
      keys[room].timeCalled = 0;
      keys[room].numbers = [];
      keys[room].ans = null;
      keys[room].turn = null;
      connections[socket.id].room = null;
    } catch (error) {
      console.log('\x1b[31m','WARNING: Ignoring user not found in room','\x1b[0m');
    }
    socket.leave(room);
    io.to(room).emit('message', `${socket.nickname} has left the room`);
    console.log(`${socket.nickname} has left the room`);
    connections[socket.id].room = null;
    if (keys[room].users.length === 0) {
      delete keys[room];
    }
    else if(keys[room].users.length === 1){
      io.to(room).emit('waitingForPlayer', 'Waiting for another player to join');
    }
    // console.dir(keys);
    // console.dir(connections);
  }
  // Exiting room
  socket.on('exitRoom', ()=>{
    console.log(`User with id: ${socket.id} exited the room`);
    exitRoom()
  });

  socket.on('disconnect', () => {
    console.log(`User with id: ${socket.id} disconnected`);
    try {
      // keys[connections[socket.id].room].users = keys[connections[socket.id].room].users.filter(user => user !== socket.nickname);
      // delete connections[socket.id];
      // // console.dir(keys);
      // // console.dir(connections);
      
      if( connections[socket.id] && connections[socket.id].room && keys[connections[socket.id].room] ){
        let room = connections[socket.id].room;
        console.log(keys[connections[socket.id].room].users);
        keys[room].users = keys[connections[socket.id].room].users.filter(user => user !== connections[socket.id].nickname);
        keys[room].id = keys[room].id.filter(id => id !== socket.id);
        // Reset the room
        keys[room].timeCalled = 0;
        keys[room].numbers = [];
        keys[room].ans = null;
        keys[room].turn = null;
        if(keys[room].users.length === 0){
          delete keys[room];
        }
      }
        delete connections[socket.id];
        console.dir(keys);
        console.dir(connections);
    } catch (error) {
      console.log(error);
      console.log('\x1b[31m','WARNING: Ignoring user not found in room','\x1b[0m');
    }
  });

  // These are the functions that will be called from the backend
  
  // Getting stats //TODO
  socket.on('getStats', () => {
    socket.emit('stats', stats);
  });

  // Resetting stats //TODO
  socket.on('resetStats', () => {
    stats = {};
    socket.emit('stats', stats);
  });

  // Reset Room //TODO
  socket.on('resetRoom', (room) => {
    keys[room] = {timeCalled:0,numbers:[],ans:null,turn:null, users:keys[room].users, id:keys[room].id,response:{correctness:null,timeUsed:null},targetLength:5};
    io.to(room).emit('roomReset', `Room ${room} has been reset`);
  });

  // Getting keys //TODO
  socket.on('getKeys', () => {
    socket.emit('keys', keys);
  });

  socket.on('setNumbersLength', (length, room) => {
    keys[room].targetLength = length;
    socket.emit('setLengthSucess', `The target length has been set to ${length}`);
  });

});


// Setting up the port
const PORT = process.env.PORT || 5172;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
}); 