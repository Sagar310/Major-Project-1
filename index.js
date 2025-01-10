const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { initializeDatabase } = require("./db/db.connect");
const User = require("./models/user.models");
const Event = require("./models/event.models");

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
  
app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

const newUser = {
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    designation: "SEO Specialist",
    profilePhotoUrl: "https://i.pravatar.cc/300"
}

const newEvent = {
    title: "Marketing Seminar",
    startTime: "Tue Aug 15 2023 at 10:00:00 AM",
    endTime: "Tue Aug 15 2023 at 12:00:00 PM",
    type: "Offline",
    hostedBy: "Marketing Experts",
    hostedAt: "Marketing City",    
    price: 3000,
    details: "Join us for an engaging Marketing Workshop on Tuesday, August 15, 2023, from 10:00 AM to 12:00 PM. This session is designed for individuals aged 18 and above who are eager to enhance their marketing skills and strategies. Whether you're a business owner, entrepreneur, or aspiring marketer, this workshop will provide valuable insights to boost your marketing efforts.Limited seats available! Reserve your spot today and take your marketing skills to the next level.",
    speakers: ["67809b4714d8a177c3247b2a", "67809b7acd3a6e1b6bb45d3e"],
    tags: ["marketing", "digital"],
    dressCode: "Smart casual",
    ageRestriction: "18 and above",
    posterImageUrl: "https://img.freepik.com/free-photo/senior-woman-artist-teaching-group-people-how-draw-sitting-chair-classroom-smiling-camera-positive-atmosphere-drawing-workshop-art-education-sketching-classes-adults_482257-64491.jpg"
}

async function createEvent(newEvent) {
    try{
        const event = new Event(newEvent);
        const saveEvent = await event.save();        
    }
    catch(error){
        console.log(error);
    }
}
//createEvent(newEvent);

async function createUser(newUser) {
    try{
        const user = new User(newUser);
        const saveUser = await user.save();        
    }
    catch(error){
        console.log(error);
    }
}
//createUser(newUser);

async function readAllEvents() {
    try{
        const events = await Event.find()
        return events;
    }
    catch(error){
        throw error;
    }
}

app.get("/events", async (req, res) => {
    try {
        const events = await readAllEvents();
        if(events.length > 0)
        {
            res.json(events);
        }
        else{
            res.status(404).json({error: "No events found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch events."});
    }
})

async function readEventByTitle(eventTitle){
    try{
        const event = await Event.findOne({title: eventTitle}).populate("speakers");
        return event;
    }
    catch(error){
        throw error
    }
}

app.get("/events/:title", async (req, res) => {
    try{
        const event = await readEventByTitle(req.params.title);
        if(event){
            res.json(event);
        }
        else{
            res.status(404).json({error: "Event not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch event."});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});