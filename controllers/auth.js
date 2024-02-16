const { response } = require("express");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/jwt");

const register = async (req, res = response) => {

    const { name, email, password } = req.body;

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

        res.json({
            ok: true,
            msg: 'Registro Creado',
            data: user,
            jwt,

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

        res.json({
            ok: true,
            msg: 'Usuario Autorizado. Token generado',
            user,
            jwt
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

module.exports = {
    register,
    login,
    renewToken,
}