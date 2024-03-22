const { Schema, model } = require('mongoose');

const ConnectedUser = Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El uid del proyecto es obligatorio']
    },
    userId: {
        type: Number,
        required: [true, 'El id del usuario es obligatorio'],
    },
    fullName: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio'],
    },
    email: {
        type: String,
    },
    online: {
        type: Boolean,
        default: false
    },
});

ConnectedUser.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('ConnectedUser', ConnectedUser);