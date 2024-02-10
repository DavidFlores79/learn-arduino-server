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


module.exports = {
    getMessages
}