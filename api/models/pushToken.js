const mongoose = require('mongoose');

const pushTokenSchema = mongoose.Schema({
    vendor: {id: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true}, vendorname: String},
    pushToken: {type:String}
});

module.exports = mongoose.model('PushToken', pushTokenSchema);