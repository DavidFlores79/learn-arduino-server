const userModel = require('../models/user');
const activationCodeModel = require('../models/activationCode');

const validateUserById = async ( id ) => {
    console.log(id);
    const userExist = await userModel.findById(id)
    if(!userExist) {
        throw new Error(`El usuario con el id: ${ id } no existe en BD.`)
    }
}

const validateCode = async ( code ) => {
    console.log({code});
    const codeExist = await activationCodeModel.findOne({ code }).sort({ createdAt: -1 });

    if(!codeExist) {
        throw new Error(`El cóigo: ${ code } no existe en BD.`);
    }
}

module.exports = { 
    validateUserById,
    validateCode,
}