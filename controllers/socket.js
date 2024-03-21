const projectModel = require('../models/user');
const userConnectedModel = require('../models/userConnected');

const projectConnected = async (uid = '') => {
    const user = await projectModel.findById(uid);
    user.online = true;
    await user.save();

    return user;
}

const projectDisconnected = async (uid = '') => {
    const user = await projectModel.findById(uid);
    user.online = false;
    await user.save();

    return user;
}

const userConnected = async (projectId = '', userId = '', fullName = '', email = '') => {

    const user = await userConnectedModel.findOne({ projectId, userId  });

    if(!user) {
        return await new userConnectedModel({ projectId, userId, fullName, email, online: true });
    }
    user.online = true;
    await user.save();
    return user;
}

const userDisconnected = async (projectId = '', userId = '') => {
    const user = await projectModel.findOne({ projectId, userId  });
    user.online = false;
    await user.save();
    return user;
}

module.exports = {
    userConnected,
    userDisconnected,
    projectConnected,
    projectDisconnected,
}