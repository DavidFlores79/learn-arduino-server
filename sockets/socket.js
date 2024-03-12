const { io } = require("../app");
const { userConnected, userDisconnected } = require("../controllers/socket");
const { validateJWTSocketSession } = require("../helpers/jwt");

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');
    const [sessionValid, uid] = validateJWTSocketSession(client.handshake.headers['x-token']);
    const clientId = client.handshake.headers['x-id'];

    if (!sessionValid) return client.disconnect();

    console.log(`cliente autenticado! userId: ${clientId}`);
    userConnected(uid);
    client.join(uid); //ingresar a la sala de ese proyecto
    if (clientId) client.join(`${uid}-${clientId}`); //ingresar a la sala de ese usuario

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

    client.on('private-message', (payload) => {
        console.log(payload);
        const { from, to, message } = payload;
        //solo se emitira al usuario para (to)
        client.to(`${uid}-${to}`).emit('private-message', payload);

        //TODO: Guardar el log en MongoDB
    })

    client.on('system-log', (payload) => {
        console.log(payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('system-log', payload);

        //TODO: Guardar el log en MongoDB
    })

    client.on('user-login', (payload) => {
        console.log(payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('user-login', payload);
    })


    /* INICIO HOPE SUCURSALES SBO */
    client.on('purchase-request', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('purchase-request', payload);
    })

    client.on('release-purchase-request', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('release-purchase-request', payload);
    })

    client.on('repayment-expenses', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('repayment-expenses', payload);
    })
    
    client.on('monitor-expenses', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('monitor-expenses', payload);
    })

    client.on('quotations', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('release-purchase-request', payload);
    })

    client.on('purchase-delivery', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('release-purchase-request', payload);
    })

    client.on('purchase-invoices', (payload) => {
        console.log('purchase-request', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('release-purchase-request', payload);
    })

    client.on('flutter-message', (payload) => {
        console.log('Flutter message', payload);
        //solo se emitira a los que esten en el mismo proyecto
        client.broadcast.to(uid).emit('message', payload);
    })
    /* INICIO HOPE SUCURSALES SBO */


});