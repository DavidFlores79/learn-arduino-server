const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    phone: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
},
{
    versionKey: false,
    timestamps: true
});

UserSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('User', UserSchema);