const mongoose = require("mongoose");
/**
 * This is we describing how the data in the database is going to look like
 * our schema now is going to have a title,image,price,location,description
 */
const Schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});
/**
 * Before we export this we have to export the compiled version model
 * that is why we call the mongoose .model() func which will compile the schema 
 * and then exports it
 */
module.exports = mongoose.model("CampGround", Schema);