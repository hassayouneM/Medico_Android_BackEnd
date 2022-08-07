const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
    steps: {
        type: Number,
        required: true,
    },
    sleepHours: {
        type: Number,
        required: true,
    },
    spo: {
        type: Number,
        required: true,
    },
    bpm: {
        type: Number,
        required: true,
    }
});

healthSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

healthSchema.set('toJSON', {
    virtuals: true,
});

exports.Health = mongoose.model('Health', healthSchema);
exports.healthSchema = healthSchema;