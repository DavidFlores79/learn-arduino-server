const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = async (req, res = response, next) => {

    const token = req.header('x-token');

    // console.log({ token });
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existe el Token en la petición.'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.PRIVATE_JWT_KEY);
        req.uid = uid;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
            error
        });
    }
}

module.exports = {
    validateJWT,
}