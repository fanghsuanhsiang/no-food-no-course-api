const mongoose = require('mongoose');

// const listSchema = mongoose.Schema({
//     product: {type: mongoose.Schema.Types.ObjectId.name, ref: 'Product', required: true},
//     quantity: {type: Number, default: 1},
//     name: {type: String, ref: 'Product'}
// });

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vendor: {id: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true}, vendorname: String},
    user: {id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, username: String},
    list: [{product: String, quantity: Number, price: Number}],
    total: {type: Number, required: true},
    hour: {type: String, required: true},
    minute: {type: String, required: true},
    remark: {type: String},
    status: {type: Boolean, default: false},
    number: {type: String}
});

module.exports = mongoose.model('Order', orderSchema);