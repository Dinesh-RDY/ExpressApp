const mongoose = require('mongoose');
const cities = require('./cities')
const campground = require('../models/campground');;
const { places, descriptors } = require('./helper');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', () => { console.error.bind(console, "Error") })
db.once('open', () => {
    console.log("Database connected");
})
const makename = array => array[Math.floor(Math.random() * array.length)];
const seeddb = async () => {
    await campground.deleteMany({});
    console.log("deleted")

    for (let i = 0; i < 50; i++) {
        // console.log("hello")

        const randnum = Math.floor(Math.random() * 1000);
        const ground = new campground({
            location: `${cities[randnum].city}, ${cities[randnum].state} `,
            title: `${makename(places)} ${makename(descriptors)}`,
            price: Math.floor(Math.random() * 500),
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima reprehenderit sequi illo facere delectus quibusdam molestiae, minus velit eos aliquid iure magnam blanditiis praesentium sint. Quisquam voluptas quae modi animi!",
            image: 'https://source.unsplash.com/collection/483251',
        })
        // console.log("hello")
        await ground.save();
    }
    db.close();
}
seeddb();