const express = require('express');
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
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

//url parser
app.use(express.json());

//Path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/v1/messages', msgRoutes);
app.use('/api/v1/users', msgRoutes);



server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(`Error: ${err}`);

    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
})