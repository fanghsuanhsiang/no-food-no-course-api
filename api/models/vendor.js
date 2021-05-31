const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    vendorname: {type: String, required: true},
    phone: {type: String, required: true},
    description: {type: String, required: true},
    opening: {type: String, required: true},
    vendorImage: {type: String},
    pushToken: {type: String}
    // orders: {type: [orderSchema], ref: 'Order', default: []}
});

module.exports = mongoose.model('Vendor', vendorSchema);
