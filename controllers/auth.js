const { response } = require("express");
const User = require('../models/user');
const activationCodeModel = require("../models/activationCode");
const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const { generateJWT, getExpTimestamp } = require("../helpers/jwt");

const register = async (req, res = response) => {

    const { name, email, password, phone } = req.body;

    try {

        const emailExist = await User.findOne({ email })
        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está registrado en la BD.'
            })
        }

        const user = new User(req.body);

        //encriptar el pass
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //generar JWT
        const jwt = await generateJWT(user.id);
        const { exp } = getExpTimestamp(jwt);

        res.json({
            ok: true,
            msg: 'Registro Creado',
            user,
            jwt,
            exp
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const activate = async (req, res = response) => {

    const { uid, code } = req.body;

    console.log({ uid});

    try {

        const codeExist = await activationCodeModel.findOne({ userUid: uid, code }).sort({ createdAt: -1 });

        if (!codeExist) {
            return res.status(404).json({ message: 'No se encontró ningún registro que coincida' });
        }

        const stillValid = isValid(codeExist.validUntil);
        if (!stillValid) {
            return res.status(400).json({ message: 'El código NO es válido' });
        }

        const data = await userModel.findByIdAndUpdate('661d59a83eb3051740a95991', {
            active: false,
        }, { new: true });
        
        return res.json({
            ok: true,
            msg: 'El código es válido.',
            data,
            code: codeExist,
            codeIsValid: isValid(codeExist.validUntil),
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            console.log('no existe!');
            return res.status(404).json({
                ok: false,
                msg: 'El email no concide con nuestros registros'
            })
        }

        //validar pass de usuario
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            console.log('Usuario No Válido!');
            return res.status(404).json({
                ok: false,
                msg: 'Error: Contraseña Incorrecta'
            })
        }


        //generar JWT
        const jwt = await generateJWT(user.id);
        const { exp } = getExpTimestamp(jwt);

        console.log(`El usuario ${user.name} se ha logueado`);

        res.json({
            ok: true,
            msg: 'Usuario Autorizado. Token generado',
            user,
            jwt,
            exp
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const renewToken = async (req, res = response) => {

    try {

        const uid = req.uid;
        const user = await User.findById(uid);
        console.log(user.name);

        const jwt = await generateJWT(user.id);

        res.json({
            ok: true,
            msg: 'Token Renovado',
            user,
            jwt,
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const isValid = ( validUntil ) => {
    // Obtiene la fecha y hora actual en formato UTC
    const currentDateUTC = new Date().toISOString();
    // Convierte la fecha de validUntil a formato UTC
    const validUntilUTC = new Date(validUntil).toISOString();
    // Compara las fechas
    return currentDateUTC <= validUntilUTC;
};

module.exports = {
    register,
    activate,
    login,
    renewToken,
}