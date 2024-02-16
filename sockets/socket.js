const { io } = require("../app");
const { userConnected, userDisconnected } = require("../controllers/socket");
const { validateJWTSocketSession } = require("../helpers/jwt");

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');
    const [sessionValid, uid] = validateJWTSocketSession(client.handshake.headers['x-token']);

    if (!sessionValid) return client.disconnect();

    console.log('cliente autenticado!');
    userConnected(uid);

    client.on('disconnect', () => {
        console.log('cliente desconectado');
        userDisconnected(uid);
    });

    client.on('message', (payload) => {
        console.log(payload);

        io.emit('message', { type: 'Generic', message: payload });
    })

    client.on('flutter-message', (payload) => {
        console.log('Flutter message', payload);
        client.broadcast.emit('message', payload);
    })


});