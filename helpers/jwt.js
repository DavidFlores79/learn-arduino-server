const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = { uid }

        jwt.sign(payload, process.env.PRIVATE_JWT_KEY, {
            expiresIn: '24h',
        }, (error, token) => {

            if (error) {
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }

        });
    });
}

const validateJWTSocketSession = (token = '') => {


    try {

        const { uid } = jwt.verify(token, process.env.PRIVATE_JWT_KEY);
        return [true, uid];

    } catch (error) {
        return [false, null];
    }

}

module.exports = {
    generateJWT,
    validateJWTSocketSession
}