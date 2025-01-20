
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

// Cuando un usuario se conecta
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Registrar al usuario
    socket.on('join', (username) => {
        users.push({ id: socket.id, username });
        io.emit('userList', users);
    });

    // Recibir mensaje
    socket.on('sendMessage', (message) => {
        // Emitir el mensaje a todos los usuarios
        io.emit('receiveMessage', message);
    });

    // Cuando el usuario se desconecta
    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit('userList', users); // Actualizar la lista de usuarios
        console.log('Usuario desconectado:', socket.id);
    });
});

server.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
