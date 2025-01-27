const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    quantity: {
        type: Number,
        required: true
    }  
},
{
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart;