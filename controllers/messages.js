const { response } = require("express");
const twilio = require('twilio');
const userModel = require("../models/user");
const activationCodeModel = require("../models/activationCode");

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
        const { uid } = req.body;

        console.log({ uid });

        const user = await userModel.findOne({ _id: uid });

        if(!user || !user.phone) {
            return res.status(404).json({
                ok: false,
                error: "No se encontrÓ número de teléfono asociado. Favor de Validar"
            });
        }

        const code = generateRandomNumber();
        console.log({user});
        
        const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: `Tu código de verificación es: ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+${user.phone}`
        })
        .then(async response => {
            console.log(response);
            const newCode = new activationCodeModel({
                userUid: user._id,
                code: code,
            });
            await newCode.save();

            
            res.json({
                ok: true,
                msg: `Mensaje enviado el número ${user.phone}!`,
                code,
                response
            });
        })
        .catch(error => {
            console.log(error)
            return res.status(400).json({
                ok: false,
                msg: 'No fue posible enviar el mensaje SMS',
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

const generateRandomNumber = () => {
    // Genera un número aleatorio en el rango [100000, 999999] (ambos inclusive)
    return Math.floor(100000 + Math.random() * 900000);
};

module.exports = {
    getMessages,
    sendMessage,
    sendSMSMessage,
    sendVerificationSMSMessage,
}