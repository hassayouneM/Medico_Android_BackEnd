const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    assistantPhone: {
        type: String,
        required: true,
    },
    assistantName: {
        type: String,
        required: true,
    },
    emergencyNum: {
        type: String,
        required: true,
    },
    
});

patientSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

patientSchema.set('toJSON', {
    virtuals: true,
});

exports.Patient = mongoose.model('Patient', patientSchema);
exports.patientSchema = patientSchema;