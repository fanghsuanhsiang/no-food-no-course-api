const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    list: [{product: String, quantity: Number}],
    hour: {type: String, required: true},
    minute: {type: String, required: true},
    remark: {type: String},
    status: {type: Boolean, default: false}
});

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    username: {type: String, required: true},
    phone: {type: String, required: true},
    easycard_number: {type: Number, required: true},
    balance: {type: Number, default: 1000},
    userImage: {type: String},
    studentId: {type: String, required: true}
    // orders: {type: [orderSchema], ref: 'Order', default: []}
});

module.exports = mongoose.model('User', userSchema);
