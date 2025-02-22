const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    productPhotoUrl: {
        type: String,
        required: true
    }  
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product;