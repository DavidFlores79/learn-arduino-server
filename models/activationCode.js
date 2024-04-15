const { Schema, model } = require('mongoose');

const ActivationCodeSchema = Schema({
    userUid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El uid del usuario es obligatorio']
    },
    code: {
        type: String,
        required: [true, 'El id del usuario es obligatorio'],
    },
    validUntil: {
        type: Date,
        default: () => {
            // Obtiene la fecha y hora actual
            const currentDate = new Date();
            // Agrega 5 minutos a la fecha actual
            currentDate.setMinutes(currentDate.getMinutes() + 5);
            // Retorna la fecha y hora actualizada
            return currentDate;
        }
    },
},
{
    versionKey: false,
    timestamps: true
});

ActivationCodeSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('ActivationCode', ActivationCodeSchema);