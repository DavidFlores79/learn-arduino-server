const { io } = require("../app");
const { userConnected, userDisconnected } = require("../controllers/socket");
const { validateJWTSocketSession } = require("../helpers/jwt");

//Mensajes de Sockets
io.on('connection', async client => {

    console.log('cliente conectado');
    const [sessionValid, uid] = validateJWTSocketSession(client.handshake.headers['x-token']);

    if (!sessionValid) return client.disconnect();

    console.log('cliente autenticado!');
    userConnected(uid);
    client.join(uid); //ingresar a la sala de ese proyecto

    client.on('disconnect', () => {
        console.log('cliente desconectado');
        userDisconnected(uid);
    });

    client.on('message', (payload) => {
        console.log('message', payload);
        io.emit('message', { type: 'message', message: payload.message, from: payload.name });
    })

    client.on('general-message', (payload) => {
        console.log('general-message', payload);
        io.emit('general-message', payload);
    })

    client.on('private-message', (payload) => {
        console.log('private-message', payload);
        const { from, to, message } = payload;
        //solo se emitira al usuario para (to)
        client.to(`${uid}-${to}`).emit('private-message', payload);
        //TODO: Guardar el log en MongoDB
    })

    client.on('system-log', (payload) => {
        console.log('system-log', payload);
        //se emitira a todos los usuarios menos el que lo envio
        client.broadcast.emit('system-log', payload);
        //TODO: Guardar el log en MongoDB
    })

    client.on('user-login', (payload) => {
        console.log('user-login', payload);
        //se emitira a todos los usuarios menos el que lo envio
        client.broadcast.emit('user-login', payload);
    })

});