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
const path = require('path');

const server = http.createServer(app);

const io = new Server(server, {
  // cors set up for react
  cors: {
    origin: ['https://iq-180.vercel.app', 'http://localhost:5173', 'http://localhost:4173'],
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
  let ans ='';
  for(let i=0; i<numbers.length; i++){
    ans+=numbers[i];
    if(i<numbers.length-1){
      ans+=ops[i];
    }
  }
  shuffle(numbers);
  return { numbers, result, ans};
}

//gen nums according to lefttoright
function getNumbersLeftToRight(targetLength){
  let numbers = [];
  let result = 0;
  let count =0;
  let ops = [];
  let invalidCalc = true;
  for (let i = 0; i < targetLength; i++) {
    numbers.push(Math.floor(Math.random() * 9)+1);
  }
  while(!Number.isInteger(result) || result<1 || result>500 || invalidCalc){
    //reset result
    result = 0;
    ops = [];
    invalidCalc = false;
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
    console.log(numbers);
    console.log(ops);
    // let equation = "";
    // for (let i=0;i<numbers.length;i++) {
    //   equation+=numbers[i];
    //   if (i!==numbers.length-1) {
    //     equation+=ops[i];
    //   }
    // }
    result = numbers[0];

    for(let i = 1; i<numbers.length;i++){
      switch(ops[i-1]){
        case '+':
          console.log(result+" + "+numbers[i]);
          result += numbers[i];
          console.log(result);
          break;
        case '-':
          console.log(result+" - "+numbers[i]);
          result -= numbers[i];
          console.log(result);
          break;
        case '*':
          console.log(result+" * "+numbers[i]);
          result *= numbers[i];
          console.log(result);
          break;
        case '/':
          console.log(result+" / "+numbers[i]);
          result /= numbers[i];
          console.log(result);
          break;
        default:
          throw new Error('Invalid operator');
      }
      if (result<0 || !Number.isInteger(result)) {
        invalidCalc=true;
      }
    }
  }
  console.log(`answer are: ${numbers} ${ops}`);
  let ans ='';
  for(let i=0; i<numbers.length; i++){
    ans+=numbers[i];
    if(i<numbers.length-1){
      ans+=ops[i];
    }
  }
  shuffle(numbers);
  return { numbers, result , ans};
}

let stats = {};
// let keys = {"Room 1":{timeCalled:0,numbers:[],ans:null,turn:null,users:[],response:{correctness:null,timeUsed:null},targetLength:5},"Room 2":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],response:{correctness:null,timeUsed:null},targetLength:5},"Room 3":{timeCalled:0,numbers:[],ans:null,turn:null, users:[],response:{correctness:null,timeUsed:null}},targetLength:5};
let keys = {};
let connections = {};
let answers = {};

io.on('connection', (socket) => {
  connections[socket.id] = {room:null,nickname:null};
  console.log(`A user with id: ${socket.id} connected`);

  socket.on('requestNumbers', () => {
    try{const temp = Array.from(socket.rooms);
    let room = temp[1];
    if (keys[room].turn === socket.id) {
      let numbers;
      let targetResult;
      // Check whether if the numbers are already generated or not.
      if (keys[room].timeCalled === 0) {
        // generate numbers according to pemdas or left to right
        let returnValues;
        if( keys[room].orderofoperations==="pemdas"){
          returnValues = genNumbers(keys[room].targetLength);
        }
        else{
          returnValues = getNumbersLeftToRight(keys[room].targetLength);
        }
        numbers = returnValues.numbers;
        targetResult = returnValues.result;
        keys[room].timeCalled = 1;
        keys[room].numbers = numbers;
        keys[room].ans = targetResult;
        answers[room] = returnValues.ans;
      }
      else if(keys[room].timeCalled === 1){
        keys[room].timeCalled += 1;
        numbers = keys[room].numbers;
        targetResult = keys[room].ans;
      }
      else{
        // generate numbers according to pemdas or left to right
        let returnValues;
        if( keys[room].orderofoperations==="pemdas"){
          returnValues = genNumbers(keys[room].targetLength);
        }
        else{
          returnValues = getNumbersLeftToRight(keys[room].targetLength);
        }
        numbers = returnValues.numbers;
        targetResult = returnValues.result;
        keys[room].timeCalled = 1;
        keys[room].numbers = numbers;
        keys[room].ans = targetResult;
        answers[room] = returnValues.ans;
      }
      // Only emit the numbers to the requested client ensuring that the numbers are not leaked to other clients!
      socket.emit('numbers', { numbers, targetResult });
      console.dir(keys);
    }
    else{
      socket.emit('message', 'It is not your turn!');
      console.log('\x1b[31m',`WARNING: ${socket.nickname} tried to call for numbers but it is not ${socket.nickname}'s turn!! `,'\x1b[0m');
    }}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
  });

  socket.on('joinRoom', ({ room, name }) => {
   try{ // Check if room exists
    if(keys[room] === undefined){
      keys[room] = { timeCalled:0,numbers:[],ans:null,turn:null, users:[], id:[],response:{correctness:null,timeUsed:null},targetLength:5,orderofoperations:"pemdas",roundLength:60, users_ready:0, attempt:3 };
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
    socket.join(room);
    keys[room].users.push(socket.nickname);
    keys[room].id.push(socket.id);
    console.log('\x1b[32m',`${name} joined ${room}`,'\x1b[0m');
    io.to(room).emit('message', `${name} has joined the room`);
    socket.emit('getReady');}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
  });

  socket.on('playerReady', () => {
    try{const temp = Array.from(socket.rooms);
    let room = temp[1];
    keys[room].users_ready += 1;
    if(keys[room].users_ready === 2 && io.sockets.adapter.rooms.get(room)?.size === 2){
      stats[keys[room].id[0]] = {nickname: keys[room].users[0], score:0 };
      stats[keys[room].id[1]] = {nickname: keys[room].users[1], score:0 };
      const randomPlayer = Math.floor(Math.random() * 2);
      keys[room].turn = keys[room].id[randomPlayer];
      console.log(`${keys[room].turn} will start the game`);
      //io.to(room).emit('startGame', {firstPlayer:keys[room].turn, attempt:keys[room].attempt});
      const opponent = connections[keys[room].id.filter(user => user !== socket.id)[0]].nickname;
      io.to(room).emit('startGame', {turn:keys[room].turn, targetLength:keys[room].targetLength, attempt:keys[room].attempt, orderofoperations:keys[room].orderofoperations,roundLength:keys[room].roundLength, opponent:opponent});
    }}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
  });

  // Sending current options to the client
  socket.on('getOption',()=>{
    try{const temp = Array.from(socket.rooms);
    let room = temp[1];
    socket.emit('options',{targetLength:keys[room].targetLength, attempt:keys[room].attempt, orderofoperations:keys[room].orderofoperations,roundLength:keys[room].roundLength});}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
  });

  // Set options (targetLength, attempt, check_leftToRight)
  socket.on('setOptions', ({targetLength, attempt , orderofoperations, roundLength}) => {
    try{const temp = Array.from(socket.rooms);
    let room = temp[1];
    keys[room].targetLength = targetLength;
    keys[room].orderofoperations = orderofoperations;
    keys[room].roundLength = roundLength;
    //check if attempt is an integer prevent from setting it to a string and noninteger
    console.log(attempt);
    if(attempt !== null){attempt = parseInt(attempt);} else{attempt = 1;}
    keys[room].attempt = attempt;
    io.to(room).emit('optionsSet', `Options set successfully`);}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
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
    let playerAnswer = nums[0];
    for(let i = 1; i<nums.length;i++){
      switch(operators[i-1]){
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
    return playerAnswer;
  }

  //TODO 
  socket.on('checkAns', ({nums, operators, timeUsed, room, attemptleft, isTimeUp})=>{
    try{// if nums and operators are valids.
    let nums_check = nums.filter((value) => value !== null);
    let operators_check = operators.filter((value) => value !== null);
    let booleanResult;
    if(nums_check.length === keys[room].targetLength && operators_check.length === (keys[room].targetLength-1) && isTimeUp !== true){ 
      try {
        playerAnswer = keys[room].orderofoperations==="lefttoright"? check_leftToRight(nums, operators) : check_pemdas(nums, operators);
        booleanResult = playerAnswer === keys[room].ans;
      } catch (error) {
        io.to(room).emit('error', { message: error.message });
      }}
      // handleTimeout!
      else if(isTimeUp === true){
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
                  [socket.id]: stats[socket.id].score,
                  [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                keys[room].turn = socket.id;
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
                  [socket.id]: stats[socket.id].score,
                  [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                // Randomly select the first player
                const firstPlayer = (Math.random()>0.5)? keys[room].id[1]:keys[room].id[0];
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
                  [socket.id]: stats[socket.id].score,
                  [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                keys[room].turn = keys[room].id.filter(user => user !== socket.id)[0];
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
              stats[keys[room].id.filter(user => user !== socket.id)[0]].score += 1;
              // Update the score on the client side
              io.to(room).emit('updateScore',{
                [socket.id]: stats[socket.id].score,
                [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
              });
              keys[room].turn = keys[room].id.filter(user => user !== socket.id)[0];
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
                [socket.id]: stats[socket.id].score,
                [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
              });
              keys[room].turn = socket.id;
              // Start next game? Second player will start
              io.to(room).emit('swapTurn',keys[room].turn);
            }
          }
            else{
              // Second player has answered incorrectly but still has attempts left
              socket.emit('wrongAnswer', attemptleft-1);
              if(!booleanResult && attemptleft > 1){
                // Emit the wrong answer event to the client and return the number of attempts left
                return;
              }
              if(keys[room].response.correctness) {
                stats[keys[room].id.filter(user => user !== socket.id)[0]].score += 1;
                keys[room].response.correctness = null;
                keys[room].response.timeUsed = null;
                keys[room].turn = keys[room].id.filter(user => user !== socket.id)[0];
                io.to(room).emit('updateScore',{
                  [socket.id]: stats[socket.id].score,
                  [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
                });
                io.to(room).emit('swapTurn',keys[room].turn);
                return;
              }
              // Both players have answered incorrectly
              io.to(room).emit('updateScore',{
                [socket.id]: stats[socket.id].score,
                [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score
              });
              
              // reset the response
              keys[room].response.correctness = null;
              keys[room].response.timeUsed = null;
              const firstPlayer = (Math.random()>0.5)? keys[room].id[1]:keys[room].id[0];
              keys[room].turn = firstPlayer;
              // Start next game? Randomly select the first player
              io.to(room).emit('swapTurn',keys[room].turn);
            }
          
        }
        else{
          if(!booleanResult){
            // Emit the wrong answer event to the client and return the number of attempts left
            socket.emit('wrongAnswer', attemptleft-1);
            if (attemptleft > 1) {
              return;
            }
          }
          // Store the response
          keys[room].response.correctness = booleanResult;
          keys[room].response.timeUsed = timeUsed;
          keys[room].turn = keys[room].id.filter(user => user !== socket.id)[0];
          // Emit the result back to the room => show a page 
          // io.to(room).emit('updateScore',{
          //   [socket.id]: stats[socket.id].score,
          //   [keys[room].id.filter(user => user !== socket.id)[0]]: stats[keys[room].id.filter(id => id !== socket.id)[0]].score});
          io.to(room).emit('swapTurn',keys[room].turn);
        }
        // Update score on the client side
        // Show updated stats  TO BE REMOVED IN THE PRODUCTION
        console.dir(stats);
      
  console.log('\x1b[32m',`Player "${socket.nickname}" submitted the "${booleanResult ? `correct within ${timeUsed}`: "wrong"}" answer`,'\x1b[0m');
  }
  catch(error){
    console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
  }
}
);

  function isUserInRoom(socket) {
    const room = connections[socket.id].room;
    if (!room || !keys[room]) {
      return false;
    }
    return keys[room].id.includes(socket.id);
  }

  function exitRoom(){
    let room;
    try{room = connections[socket.id].room;}
    catch(error){
      console.log('\x1b[31m',`ERROR: ${error}`,'\x1b[0m');
    }
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
    connections[socket.id].nickname = null;
    try{if (keys[room].users.length === 0) {
      delete keys[room];
      delete answers[room];
    }
    else if(keys[room].users.length === 1){
      io.to(room).emit('waitingForPlayer', 'Waiting for another player to join');
    }}
    catch(error){
      console.log('\x1b[31m',`WARNING: ${error}`,'\x1b[0m1');
      }
    // console.dir(keys);
    // console.dir(connections);
  }
  // Exiting room
  socket.on('exitRoom', ()=>{
    console.log(`User with id: ${socket.id} exited the room`);
    exitRoom()
    delete connections[socket.id];
    socket.disconnect();
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
          delete answers[room];
        }
        io.to(room).emit('userDisconnected', connections[socket.id].nickname );
      }
        delete connections[socket.id];
        console.dir(keys);
        console.dir(connections);
    } catch (error) {
      console.log(error);
      console.log('\x1b[31m','WARNING: Ignoring user not found in room','\x1b[0m');
    }
  });

  socket.on('fetchLeaderBoard',() => {
    temp = stats;
    const statsArray = Object.entries(stats);
    statsArray.sort(([, a], [, b]) => b.score - a.score);
    const sortedStats = Object.fromEntries(statsArray);
    console.log(sortedStats);
    socket.emit('leaderBoard', sortedStats);
  });

});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../iq180-admin/dist')));

app.get('/connections', (req, res) => {
  res.json(connections);
});

app.get('/keys', (req, res) => {
  res.json(keys);
});

app.get('/stats', (req, res) => {
  res.json(stats);
});

app.get('/answers', (req, res) => {
  res.json(answers);
});

app.get('/allData', (req, res) => {
  res.json({connections, keys, stats, answers});
});

app.get('/reset', (req, res) => {
  keys = {};
  connections = {};
  stats = {};
  answers = {};
  io.emit('serverReset');
  // disconnect all the clients
  io.sockets.sockets.forEach((socket) => {
    socket.disconnect(true);
  });
  res.send('Resetting server. Kicking everyone out!!!');
});

app.post('/resetRoom', (req, res) => {
  const room = req.body.room;
  console.log(room);
  if (!room) {
    res.status(400).send('Room parameter is missing');
    return;
  }
  if (keys[room] === undefined) {
    res.status(404).send(`${room} is not a valid room`);
    return;
  }
  if(keys[room].users.length === 2){
    stats[keys[room].id[0]].score = 0;
    stats[keys[room].id[1]].score = 0;
    keys[room].users_ready = 2;
    keys[room].timeCalled = 0;
    keys[room].numbers = [];
    keys[room].ans = null;
    keys[room].response = {correctness:null,timeUsed:null};
    const randomPlayer = Math.floor(Math.random()*1);
    keys[room].turn = keys[room].id[randomPlayer];
    io.to(room).emit('resetRoom', {turn:keys[room].turn, targetLength:keys[room].targetLength, attempt:keys[room].attempt, orderofoperations:keys[room].orderofoperations});
  }
  else{
    res.status(400).send(`${room} does not have 2 players`);
    return;
  }
  res.send(`Room ${room} has been reset`);
});

app.get('/resetScores', (req, res) => {
  Object.keys(stats).forEach((key) => {
    stats[key].score = 0;
  });
  io.emit('resetScores');
  res.send('Scores have been reset');
});

// Setting up the port
const PORT = process.env.PORT || 5172;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
}); 
