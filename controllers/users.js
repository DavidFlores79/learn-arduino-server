const { response } = require("express");
const userModel = require("../models/user");
const connectedUserModel = require("../models/userConnected");

const getUsers = async (req, res = response) => {

    try {

        const users = await userModel.find({ _id: { $ne: req.uid } }).sort('-online');

        res.json({
            ok: true,
            msg: 'Todos los Usuarios',
            users
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const getConnectedUsers = async (req, res = response) => {

    try {

        const users = await connectedUserModel.find().sort('-online');

        res.json({
            ok: true,
            msg: 'Usuarios Conectados/No Conectados',
            users
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}


module.exports = {
    getUsers,
    getConnectedUsers,
}