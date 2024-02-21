const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const msgRoutes = require('./routes/msg');

//DB Config
const { dbConnection } = require('./database/config');
dbConnection();

const app = express();

// Websocket Server
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
});
module.exports.io = io;
require('./sockets/socket');

//url parser
app.use(express.json());

//Path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//agregar io al request
app.use(function (req, res, next) {
    req.io = io;
    next();
});

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/v1/messages', msgRoutes);
app.use('/api/v1/users', userRoutes);



server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(`Error: ${err}`);

    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
})