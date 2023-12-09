const { io } = require("../app");
const Band = require("../models/band");
const Bands = require("../models/bands");
const bands =  new Bands();

bands.addBand( new Band('Queen') );
bands.addBand( new Band('ACDC') );
bands.addBand( new Band('Metálica') );
bands.addBand( new Band('Bon Jovi') );

console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('message', ( payload ) => {
        console.log(payload);

        io.emit('message', { type: 'Generic', message: 'Nuevo mensaje'});
    })

    client.on('flutter-message', ( payload ) => {
        console.log('Flutter message', payload);
        client.broadcast.emit('message', payload);
    })

    client.on('vote-band', ( payload ) => {
        console.log('Vote band', payload);
        bands.voteBand(payload);
        io.emit('active-bands', bands.getBands());
    })

    client.on('add-band', ( payload ) => {
        console.log('Add band', payload);
        bands.addBand(payload);
        io.emit('active-bands', bands.getBands());
    })

    client.on('remove-band', ( payload ) => {
        console.log('Remove band', payload);
        bands.removeBand(payload);
        io.emit('active-bands', bands.getBands());
    })

});