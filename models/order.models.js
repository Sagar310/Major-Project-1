const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    status: {
        type: String,        
        enum: ["Pending", "Shipped", "Delivered"]
    },
    expectedDeliveryDate: { 
        type: Date, 
        default: Date.now        
    },
    actualDeliveryDate: { 
        type: Date, 
        default: Date.now 
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }    
},
{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;