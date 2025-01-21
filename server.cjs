
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = ["http://localhost:1420", "http://localhost:3001"];

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("No permitido por CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
    },

    transports: ['websocket', 'polling']
});

let users = [];

io.on('connection', (socket) => {

    socket.on('join', (username) => {
        users.push({ id: socket.id, username });
        io.emit('userList', users);
    });

    socket.on('sendMessage', (message) => {
        console.log('Mensaje recibido:', message);
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit('userList', users);
    });

    socket.on('typing', (username) => {
        console.log(username, 'está escribiendo...');
        socket.broadcast.emit('userTyping', username);
    });

    socket.on('stoppedTyping', () => {
        socket.broadcast.emit('userStoppedTyping');
    });

});

server.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
