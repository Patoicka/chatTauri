const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cloudinary = require('cloudinary').v2;
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin_chat',
    password: '199624',
    database: 'chatBot'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL con ID ' + db.threadId);
});

const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:1420", "http://localhost:3001"],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});

// Configuración de Cloudinary
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

const getDeepSeekResponse = async (message) => {

    console.log('Mensaje bot:', message);

    try {
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message },
                ],
                stream: false,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-65cff989781a4cec861920a2d9074488',
                },
            }
        );
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error DeepSeek:', error);
        return "Lo siento, no puedo responder en este momento.";
    }
};

let users = [];

io.on('connection', (socket) => {

    socket.on('sendMessage', async (message) => {
        const { text, selectChat } = message;
        console.log('Mensaje recibido en el servidor:', message);
        io.emit('receiveMessage', message);

        if (selectChat) {
            io.emit('thinking', true);

            const botResponse = await getDeepSeekResponse(text);

            const botMessage = {
                text: botResponse,
                user: "ChatBot",
                time: new Date().toLocaleTimeString(),
                image: null,
            };

            setTimeout(() => {
                io.emit('receiveMessage', botMessage);
                io.emit('thinking', false);
                console.log('Respuesta del ChatBot:', botMessage);
            }, 1000);
        }
    });

    socket.on('editMessage', (editedMessage) => {
        console.log('Mensaje editado recibido:', editedMessage);
        io.emit('messageEdited', editedMessage);
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