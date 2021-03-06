const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const res = require("express/lib/response");

// setup the port our backend app will run on
const PORT = process.env.PORT || 3030;
const NEW_MESSAGE_EVENT = "new-message-event";

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: true,
    origins: PORT,
});

app.use(cors());

// Hardcoding a room name here. This is to indicate that you can do more by creating multiple rooms as needed.
const room = "general"

io.on("connection", (socket) => {
    socket.join(room);

    socket.on(NEW_MESSAGE_EVENT, (data) => {
        io.in(room).emit(NEW_MESSAGE_EVENT, data);
    });

    socket.on("disconnect", () => {
        socket.leave(room);
    });
});

app.get('/', function (req, res) {
    res.send("I am working successfully");
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});