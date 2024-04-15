const { response } = require("express");
const twilio = require('twilio');

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

        console.log({ payload });
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

const sendSMSMessage = async (req, res = response) => {

    try {
        const { to, message } = req.body;

        console.log({ to, message });

        const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        })
        .then(response => {
            console.log(response)
            
            res.json({
                ok: true,
                msg: 'Mensaje enviado!',
                response
            });
        })
        .catch(error => {
            console.log(error)
            return res.status(400).json({
                ok: false,
                error
            })    
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const sendVerificationSMSMessage = async (req, res = response) => {

    try {
        const { to } = req.body;

        console.log({ to });

        const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: 'Tu código de verificación es: 162596',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        })
        .then(response => {
            console.log(response)
            
            res.json({
                ok: true,
                msg: 'Mensaje enviado!',
                response
            });
        })
        .catch(error => {
            console.log(error)
            return res.status(400).json({
                ok: false,
                error
            })    
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
    sendSMSMessage,
    sendVerificationSMSMessage,
}