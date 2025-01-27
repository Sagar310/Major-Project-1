const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,        
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    } 
},
{
    timestamps: true
});

const OrderProduct = mongoose.model('OrderProduct', orderProductSchema)

module.exports = OrderProduct;