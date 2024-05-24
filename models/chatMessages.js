const { Schema, model } = require('mongoose');

const ChatMessageSchema = Schema({
    chatId: {
        type: String,
        required: true,
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
        required: true,
    },
    model: {
        type: String,
        required: true,
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