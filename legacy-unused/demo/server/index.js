// Setting up Socketio server
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
    origin: 'http://localhost:5173',
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

  socket.on('requestNumbers', () => {
    let numbers;
    let targetResult;
    do {
      numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      targetResult = Math.floor(Math.random() * 10); // Ensure target result is a one-digit number
    } while (!isSolvable(numbers, targetResult));

    socket.emit('numbers', { numbers, targetResult });
  });

  socket.on('joinRoom', ({ room, name }) => {
    socket.join(room);
    console.log(`${name} joined ${room}`);
    io.to(room).emit('message', `${name} has joined the room`);
  });

  socket.on('sentMessage', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log(`User with id: ${socket.id} disconnected`);
  });
});

server.listen(5172, () => {
  console.log('listening on *:5172');
});