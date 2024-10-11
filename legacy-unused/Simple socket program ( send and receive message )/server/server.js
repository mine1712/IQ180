const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(
  cors({
    origin: true, // Allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: true, // Allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sent-message", (message) => {
    console.log("Message received:", message);
    io.emit("new-message", message); // Broadcast the message to all clients
  });

  socket.on("say-hello", (message) => {
    console.log("The client says:", message);
    io.emit("new-message", "message received.");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(9000, () => {
  console.log("Server is listening on port 9000");
});
