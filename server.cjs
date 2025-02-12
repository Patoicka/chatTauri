const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2");
const multer = require("multer");

const app = express();
const server = http.createServer(app);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Asegúrate de que esta carpeta exista en tu proyecto
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: storage });

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
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});

app.use(cors({
    origin: ["http://localhost:1420", "http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}));
app.use(bodyParser.json({ limit: "10mb" }));
app.options("*", cors());

app.post("/upload-image", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    console.log("Archivo subido:", req.file);

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

io.on("connection", (socket) => {
    socket.on("findMessages", () => {
        const sql = "SELECT * FROM chatbot ORDER BY date ASC";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error al obtener mensajes:", err);
                return;
            }
            console.log(results);
            socket.emit("foundMessages", results);
        });
    });

    socket.on("sendMessage", async (message, think) => {
        const { usuario, asunto, descripcion, date, imagen, selectChat } = message;
        io.emit("receiveMessage", message);
        if (selectChat) {
            if (!think) {
                io.emit("thinking", false);
            } else {
                io.emit("thinking", true);
            };

            const sql = "INSERT INTO chatbot (usuario, asunto, descripcion, date, imagen) VALUES (?, ?, ?, ?, ?)";
            db.query(sql, [usuario, asunto, descripcion, date, imagen], (err, result) => {
                if (err) {
                    console.error("Error al guardar mensaje:", err);
                    return;
                };
                const savedMessage = { id: result.insertId, ...message };
                io.emit("receiveMessage", savedMessage);
            });
        }
    });

    socket.on("deleteMessage", (messageId) => {
        console.log('ID para eliminar: ', messageId);

        if (messageId === "all") {
            console.log("Eliminar todos los mensajes");
            const sql = "DELETE FROM chatbot";
            db.query(sql, (err, result) => {
                if (err) {
                    console.error("Error al eliminar todos los mensajes:", err);
                    return;
                }
                console.log("Todos los mensajes fueron eliminados.");
                io.emit("allMessagesDeleted");
            });
        } else {
            console.log(`Eliminar mensaje con ID: ${messageId}`);
            const sql = "DELETE FROM chatbot WHERE id = ?";
            db.query(sql, [messageId], (err, result) => {
                if (err) {
                    console.error("Error al eliminar mensaje:", err);
                    return;
                }
                if (result.affectedRows > 0) {
                    console.log(`Mensaje con ID ${messageId} eliminado`);
                    io.emit("messageDeleted", messageId); // Notificar a todos los clientes
                } else {
                    console.log(`No se encontró un mensaje con ID ${messageId}`);
                }
            });
        }
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("userTyping", username);
    });

    socket.on("stoppedTyping", () => {
        socket.broadcast.emit("userStoppedTyping");
    });
});

server.listen(4000, () => {
    console.log("Servidor corriendo en http://localhost:4000");
});
