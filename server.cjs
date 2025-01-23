const cors = require('cors'); // Requerir cors
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cloudinary = require('cloudinary').v2;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:1420", "http://localhost:3001"],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});

cloudinary.config({
    cloud_name: 'di461de4z',
    api_key: '631417838377461',
    api_secret: 'GPPQllpSBXcWM4oRzL0YMVyUUnE',
});

app.use(cors({
    origin: ["http://localhost:1420", "http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}));

app.use(bodyParser.json({ limit: '10mb' }));

app.options('*', cors());

app.post('/upload-image', async (req, res) => {
    console.log('Solicitud recibida en /upload-image:', req.body);
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'chat-images',
        });

        res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

let users = [];
console.log('Usuarios conectados:', users);

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        users.push({ id: socket.id, username });
        console.log('Usuarios conectados:', username);
        io.emit('userList', users);
    });

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
        console.log('mensaje enviado', message);
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit('userList', users);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('userTyping', username);
    });

    socket.on('stoppedTyping', () => {
        socket.broadcast.emit('userStoppedTyping');
    });
});

server.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
