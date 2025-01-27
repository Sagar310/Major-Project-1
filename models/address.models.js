const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,        
        required: true
    },
    city: {
        type: String,        
        required: true
    },
    state: {
        type: String,        
        required: true
    },
    country: {
        type: String,        
        required: true
    },
    postalCode: {
        type: String,        
        required: true
    },
    isDefault: {
        type: Boolean,        
        default: false
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    } 
},
{
    timestamps: true
});

const Address = mongoose.model('Address', addressSchema)

module.exports = Address;