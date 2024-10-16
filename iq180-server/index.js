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

const server = http.createServer(app);

const io = new Server(server, {
  // cors set up for react
  cors: {
    origin: ['http://localhost:5173','http://localhost:5174'],
    methods: ['GET', 'POST'],
  },
});

const operators = ['+', '-', '*', '/'];

function genNumbers(targetLength){
  let numbers = [];
  let result = 0;
  let count =0;
  for (let i = 0; i < targetLength; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  while(!Number.isInteger(result) || result<1 || result>500){
    //reset result
    result = 0;
    // if the loop runs more than 200 times, reset the numbers
    if(count++>200){
      numbers =[];
      for (let i = 0; i < targetLength; i++) {
      numbers.push(Math.floor(Math.random() * 10));
      }
      count = 0;
    }
    for(let i = 0; i < numbers.length; i++){
      if(numbers[i] !== 0){
        switch (operators[Math.floor(Math.random() * 4)]) {
          case '+':
            result += numbers[i];
            break;
          case '-':
            result -= numbers[i];
            break;
          case '*':
            result *= numbers[i];
            break;
          case '/':
            result /= numbers[i];
            break;
          default:
            throw new Error('Invalid operator');
        }
      }
      else{
        switch (operators[Math.floor(Math.random() * 3)]) {
          case '+':
            result += numbers[i];
            break;
          case '-':
            result -= numbers[i];
            break;
          case '*':
            result *= numbers[i];
            break;
          default:
            throw new Error('Invalid operator');
        }}}
  }
  return { numbers, result };
}

let stats = {};
let keys = {"Room 1":{timeCalled:0,numbers:[],ans:null,turn:null,users:[],id:[]},"Room 2":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],id:[]},"Room 3":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],id:[]}};
let targetLength = 5;

io.on('connection', (socket) => {
  console.log(`A user with id: ${socket.id} connected`);

  socket.on('requestNumbers', () => {
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    if (keys[room].turn === socket.nickname) {
      let numbers;
      let targetResult;
      // Check whether if the numbers are already generated or not.
      if (keys[room].timeCalled === 0) {
        const returnVaules = genNumbers(targetLength);
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
        const returnVaules = genNumbers(targetLength);
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
      keys[room] = {timeCalled:0,numbers:[],ans:null,turn:null, users:[], };
    }
    // Check if room is full
    if(io.sockets.adapter.rooms.get(room)?.size === 2) {
      socket.emit('roomFull', 'Room is full');
      return;
    }
    // Added joinRoomSuccess event to notify the client that the room has been joined successfully
    socket.emit('joinRoomSuccess', `Room joined successfully`);
    //Set nickname
    socket.nickname = name;
    //setting up the scoreboard
    if(!room in stats){
      stats[room] = {name:0};
    }
    socket.join(room);
    keys[room].users.push(socket.nickname);
    console.log('\x1b[32m',`${name} joined ${room}`,'\x1b[0m');
    io.to(room).emit('message', `${name} has joined the room`);
    if(io.sockets.adapter.rooms.get(room)?.size === 2) {
      const roomSocket = io.sockets.adapter.rooms.get(room);
      const nicknames = [];
      roomSocket.forEach(socketId => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && socket.nickname) {
          nicknames.push(socket.nickname);
        }
      });
      const firstPlayer = (Math.random()>0.5)? nicknames[1]:nicknames[0];
      keys[room].turn = firstPlayer;
      console.log(`${firstPlayer} will start the game`);
      io.to(room).emit('startGame',firstPlayer);
    }
  });

  //TODO 
  socket.on('checkAns', ({nums, operators, timeUsed, room})=>{
   if(nums){ try {
      let equation = "";
        for (let i=0;i<nums.length;i++) {
            equation+=nums[i];
            if (i!==nums.length-1) {
                equation+=operators[i];
            }
        }
      let playerAnswer = eval(equation);
      let booleanResult = playerAnswer === keys[room].ans;
      // Update stats  TO FIX this doesn't take time into account
      if(booleanResult){
        // Change turn
        let users = keys[room].users;
        const userIndex = users.indexOf(socket.nickname);
        if (userIndex !== -1) {
          users.splice(userIndex, 1);
        }
        if(stats[room][socket.nickname] === undefined){
          stats[room][socket.nickname] = 1;
        }
        else{
          stats[room][socket.nickname] += 1;
          io.to(room).emit('updateScore', [ socket.nickname, stats[room][socket.nickname] ]);
        }
      }
      // Emit the result back to the room
      io.to(room).emit('answerChecked', { booleanResult });
      // Update score on the client side
      // Show updated stats  TO BE REMOVED IN THE PRODUCTION
      console.dir(stats);
    } catch (error) {
      io.to(room).emit('error', { message: error.message });
    }}

  });

  // Exiting room
  socket.on('exitRoom', () => {
    const temp = Array.from(socket.rooms);
    let room = temp[1];
    keys[room].users = 0;
    keys[room].users.pop(socket.nickname);
    socket.leave(room);
    io.to(room).emit('message', `${socket.nickname} has left the room`);
    console.log(`${socket.nickname} has left the room`);
  });

  socket.on('disconnect', () => {
    console.log(`User with id: ${socket.id} disconnected`);
    try {
      keys[room].users.pop(socket.nickname);
    } catch (error) {
      //console.log(error);
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

  // Getting keys //TODO
  socket.on('getKeys', () => {
    socket.emit('keys', keys);
  });

  socket.on('setNumbersLength', (length) => {
    targetLength = length;
  });

});



server.listen(5172, () => {
  console.log('listening on *:5172');
}); 