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
    client.join(uid); //ingresar a la sala de ese proyecto

    client.on('disconnect', () => {
        console.log('cliente desconectado');
        userDisconnected(uid);
    });

    client.on('message', (payload) => {
        console.log(payload);
        io.emit('message', { type: 'message', message: payload.message, from: payload.name });
    })

    client.on('general-message', (payload) => {
        console.log(payload);
        io.emit('general-message', payload);
    })

    client.on('system-log', (payload) => {
        console.log(payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('system-log', payload);

        //TODO: Guardar el log en Mongo
    })

    client.on('user-login', (payload) => {
        console.log(payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('user-login', payload);
    })

    client.on('purchase-request', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('purchase-request', payload);
    })

    client.on('flutter-message', (payload) => {
        console.log('Flutter message', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('message', payload);
    })
});