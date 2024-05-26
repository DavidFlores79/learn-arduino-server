const { Schema, model } = require('mongoose');

const ChatMessageSchema = Schema({
    chatId: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El id del usuario es obligatorio']
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    model: {
        type: String,
    },
    name: {
        type: String,
        default: null,
    },
    function_call: {
        type: Object,
        default: null,
    },
},
{
    versionKey: false,
    timestamps: true
});

ChatMessageSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('ChatMessage', ChatMessageSchema);