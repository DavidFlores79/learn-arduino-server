const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Websocket Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

//Path publico
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));


server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(`Error: ${err}`);

    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
})