const { io } = require("../app");

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('message', (payload) => {
        console.log(payload);

        io.emit('message', { type: 'Generic', message: 'Nuevo mensaje' });
    })

    client.on('flutter-message', (payload) => {
        console.log('Flutter message', payload);
        client.broadcast.emit('message', payload);
    })


});