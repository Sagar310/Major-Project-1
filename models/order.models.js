const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,        
        enum: ["Pending", "Shipped", "Delivered"]
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