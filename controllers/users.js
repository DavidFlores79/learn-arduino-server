const { response } = require("express");

const getUsers = async (req, res = response) => {

    try {

        res.json({
            ok: true,
            msg: 'Todos los Usuarios',
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}


module.exports = {
    getUsers
}