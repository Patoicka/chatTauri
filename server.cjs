const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cloudinary = require("cloudinary").v2;
const mysql = require("mysql2");

const app = express();
const server = http.createServer(app);

const db = mysql.createConnection({
    host: "localhost",
    user: "admin_chat",
    password: "199624",
    database: "chatBot",
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }

    db.query('SELECT * FROM chatbot', (error, results) => {
        if (error) throw error;
        console.log('Datos en la tabla chatbot');
    });
});


const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:1420", "http://localhost:3001"],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});

cloudinary.config({
    cloud_name: "di461de4z",
    api_key: "631417838377461",
    api_secret: "GPPQllpSBXcWM4oRzL0YMVyUUnE",
});

app.use(cors({
    origin: ["http://localhost:1420", "http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}));
app.use(bodyParser.json({ limit: "10mb" }));
app.options("*", cors());

const getDeepSeekResponse = async (message) => {
    console.log("Mensaje bot:", message);

    try {
        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
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
                    "Content-Type": "application/json",
                    Authorization: "Bearer sk-65cff989781a4cec861920a2d9074488",
                },
            }
        );
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error DeepSeek:", error);
        return "Lo siento, no puedo responder en este momento.";
    }
};

io.on("connection", (socket) => {
    socket.on("findMessages", () => {
        const sql = "SELECT * FROM chatbot ORDER BY time ASC";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error al obtener mensajes:", err);
                return;
            }
            console.log(results);
            socket.emit("foundMessages", results);
        });
    });

    socket.on("sendMessage", async (message) => {
        const { text, selectChat, user, time, image } = message;
        console.log("Mensaje recibido en el servidor:", message);
        io.emit("receiveMessage", message);

        if (selectChat) {
            io.emit("thinking", true);

            const sql = "INSERT INTO chatbot (user, text, time, image) VALUES (?, ?, ?, ?)";
            db.query(sql, [user, text, time, image], (err, result) => {
                if (err) {
                    console.error("Error al guardar mensaje:", err);
                    return;
                }

                const savedMessage = { id: result.insertId, ...message };
                io.emit("receiveMessage", savedMessage);
            });

            const botResponse = await getDeepSeekResponse(text);

            const botMessage = {
                text: botResponse,
                user: "ChatBot",
                time: new Date().toISOString(),
                image: '',
            };

            setTimeout(() => {
                db.query(sql, ["ChatBot", botResponse, botMessage.time, botMessage.image], (err, result) => {
                    if (err) {
                        console.error("Error al guardar respuesta del bot:", err);
                        return;
                    }
                    botMessage.id = result.insertId;
                    io.emit("receiveMessage", botMessage);
                });

                io.emit("thinking", false);
                console.log("Respuesta del ChatBot:", botMessage);
            }, 1000);
        }
    });

    socket.on("deleteMessage", (messageId) => {
        console.log(`Eliminar mensaje con ID: ${messageId}`);

        const sql = "DELETE FROM chatbot WHERE id = ?";
        db.query(sql, [messageId], (err, result) => {
            if (err) {
                console.error("Error al eliminar mensaje:", err);
                return;
            }
            console.log(`Mensaje con ID ${messageId} eliminado`);
            io.emit("messageDeleted", messageId);  // Notifica a todos los clientes que se ha eliminado el mensaje
        });
    });

    // 🔹 Eliminar mensaje de la BD si selectChat es true
    // socket.on("deleteMessage", (messageId) => {
    //     const sql = "DELETE FROM messages WHERE id = ?";
    //     db.query(sql, [messageId], (err) => {
    //         if (err) {
    //             console.error("Error al eliminar mensaje:", err);
    //             return;
    //         }
    //         io.emit("messageDeleted", messageId);
    //     });
    // });

    socket.on("typing", (username) => {
        socket.broadcast.emit("userTyping", username);
    });

    socket.on("stoppedTyping", () => {
        socket.broadcast.emit("userStoppedTyping");
    });

    // socket.on("disconnect", () => {
    //     console.log("Usuario desconectado:", socket.id);
    // });
});

server.listen(4000, () => {
    console.log("Servidor corriendo en http://localhost:4000");
});
