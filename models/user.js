const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
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
    },
    address: {
        type: String,
        default:'',
    },
    isAssistant: {
        type: Boolean,
        default: false,
    },
    age: {
        type: String,
        default:'',
    },
    bloodType: {
        type: String,
        default:'',
    },
    assistantPhone: {
        type: String,
        default:'',
    },
    assistantName: {
        type: String,
        default:'',
    },
    emergencyNum: {
        type: String,
        default:''
    },
});

// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// userSchema.set('toJSON', {
//     virtuals: true,
// });

//Transform: remove _id
userSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
 });

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;