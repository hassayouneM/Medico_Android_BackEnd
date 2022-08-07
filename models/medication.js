const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    ref: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dose: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    expDate: {
        type: String
    },
    image: {
        type: String,
        default:''
    },
});

medicationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

medicationSchema.set('toJSON', {
    virtuals: true,
});

exports.Medication = mongoose.model('Medication', medicationSchema);
exports.medicationSchema = medicationSchema;