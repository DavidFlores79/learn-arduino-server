const { response } = require("express");

const getMessages = async (req, res = response) => {

    try {

        res.json({
            ok: true,
            msg: 'Todos los Mensajes',
            uid: req.uid
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const sendMessage = async (req, res = response) => {

    try {
        const { type, payload } = req.body;

        req.io.emit(type, payload);

        res.json({
            ok: true,
            msg: 'Mensaje enviado!',
            uid: req.uid
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}


module.exports = {
    getMessages,
    sendMessage,
}