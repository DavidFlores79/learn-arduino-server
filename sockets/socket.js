const { io } = require("../app");

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('message', ( payload ) => {
        console.log(payload);

        io.emit('message', { message: 'Nuevo mensaje'});
    })

});