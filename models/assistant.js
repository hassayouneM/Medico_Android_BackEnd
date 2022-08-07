const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    }
});

assistantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

assistantSchema.set('toJSON', {
    virtuals: true,
});

exports.Assistant = mongoose.model('Assistant', assistantSchema);
exports.assistantSchema = assistantSchema;