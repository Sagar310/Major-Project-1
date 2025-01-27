const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    categoryPhotoUrl: {
        type: String,
        required: true
    } 
},
{
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema)

module.exports = Category;