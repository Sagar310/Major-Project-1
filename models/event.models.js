const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    type: {
        type: String,        
        enum: ["Online", "Offline", "Both"]
    },
    hostedBy: {
        type: String,
        required: true
    },
    hostedAt: {
        type: String,
        required: true
    },    
    price: {
        type: Number,
        default: 0
    },
    details: {
        type: String,
        required: true,
    },
    speakers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tags: [
        {
            type: String,            
        }
    ],
    dressCode: {
        type: String        
    },
    ageRestriction: {
        type: String        
    },
    posterImageUrl: {
        type: String,
        required: true
    }    
},
{
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;