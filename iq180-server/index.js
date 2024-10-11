// Setting up Socketio server
//list of functions and their purpose
// joinRoom - join a room (will emit roomFull if room is full) //TODO : add a check for roomFull on client side
// TODO localhost:5174 will be the react project for scoreboard!
// requestNumbers - request for numbers to be generated (receive target length from client if none provided will be 5 numbers)
// startGame will be call when room has 2 users and firstPlayerName will be emited //TODO : startGame on client based on firstPlayer
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

function isSolvable(numbers, target) {
  function helper(nums, target) {
    if (nums.length === 1) {
      return Math.abs(nums[0] - target) < 1e-6;
    }

    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i !== j) {
          const remaining = nums.filter((_, index) => index !== i && index !== j);
          for (const op of operators) {
            let result;
            if (op === '+') result = nums[i] + nums[j];
            if (op === '-') result = nums[i] - nums[j];
            if (op === '*') result = nums[i] * nums[j];
            if (op === '/' && nums[j] !== 0) result = nums[i] / nums[j];

            if (result !== undefined) {
              if (helper([...remaining, result], target)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  return helper(numbers, target);
}

io.on('connection', (socket) => {
  console.log(`A user with id: ${socket.id} connected`);

  socket.on('requestNumbers', (targetLength) => {
    let numbers;
    let targetResult; // receive target result from client if none provided will be 5 numbers
    targetLength = (targetLength == null) ? 5 : targetLength;
    do {
      numbers = Array.from({ length: targetLength }, () => Math.floor(Math.random() * 10));
      targetResult = Math.floor(Math.random() * 10); // Ensure target result is a one-digit number
    } while (!isSolvable(numbers, targetResult));

    socket.emit('numbers', { numbers, targetResult });

  });

  socket.on('joinRoom', ({ room, name }) => {
    //Set nickname
    socket.nickname = name;
    // Check if room is full
    if(io.sockets.adapter.rooms.get(room)?.size === 2) {
      socket.emit('roomFull', 'Room is full');
      return;
    }
    socket.join(room);
    console.log(`${name} joined ${room}`);
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
      io.to(room).emit('startGame',firstPlayer);
    }
  });


  socket.on('disconnect', () => {
    console.log(`User with id: ${socket.id} disconnected`);
  });
});

server.listen(5172, () => {
  console.log('listening on *:5172');
});