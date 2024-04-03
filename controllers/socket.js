const projectModel = require('../models/user');
const userConnectedModel = require('../models/userConnected');

const userConnected = async (uid = '') => {
    const user = await projectModel.findById(uid);
    user.online = true;
    await user.save();
    return user;
}

const userDisconnected = async (uid = '') => {
    const user = await projectModel.findById(uid);
    user.online = false;
    await user.save();
    return user;
}

module.exports = {
    userConnected,
    userDisconnected,
}