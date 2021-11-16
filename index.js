/**
 * We will import the schema required to make the data base
 */
const Campground = require("./models/Campground");
/**=============================== */

/**
 * Now we will set up our mongoose data base and then connect it to our app
 */
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Connection established");
});

/**========================================================================== */
/*This is we creating oue express app*/
const express = require("express");
app = express();

/* ------------------------------------*/


/*=======================================================================================
This is we setting up our view engine to ejs . It helps by 
At runtime, the template engine replaces variables in a template file with actual values,
and transforms the template into an HTML file sent to the client.
This approach makes it easier to design an HTML page.
*/
app.set("view engine", 'ejs');
const path = require("path");
app.set("views", path.join(__dirname, "views"));
/**
 * This sets up the path where the view engine should look for 
 */
/**=================================================================================== */

/**
 * express doesn't have the ability to use post method 
 * it only has the ability to get and set 
 * To use the post method we have to use a package called 
 * Method- Override 
 */
const override = require("method-override");
app.use(override("_method"));
app.use(express.urlencoded({ extended: true }));

const ejsMate = require("ejs-mate")
app.engine("ejs", ejsMate);
app.get("/", (req, res) => {
    // res.send("Hey We are here ");
    res.render("home");
});

/**
 * Our form should also have some error handling mechanism
 * what if there is some problem in awaiting a result in a aync 
 * function. We have to handle it.
 * Thus we have written our own error handler 
 * and a class to wrap the async function 
 * "First we will require them :==="
 * */
const handle = require("./utils/catchAsync");
const err = require("./utils/ExpressError");



app.get("/campgrounds", handle(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))
app.get("/campgrounds/new", handle((req, res) => {
    res.render('campgrounds/new');
}))
app.get("/campgrounds/:id", handle(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    res.render("campgrounds/show", { campgrounds })
}))
/* We keep the app.listen() to the last because we want to first initialize the window  
    first then open it.
    Normally this doesn't really change a lot of things but to be more precise we do this
    Hence after configuring all the routes we will keep start the app to listen to start
    listening to requests
*/

app.get("/campgrounds/:id/edits", handle(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    res.render("campgrounds/edit", { campgrounds })
}))
/**
 * This is the route to make the new campground !!
 */
const Joi = require("joi");
/**
 * We will put this Joi into a middleware and use it
 */
const validator = require("./schemas");
const validate = (req, res, next) => {

    const { error } = validator.validate(req.body);
    console.log("Error")
    if (error) {
        const msg = error.details.map(ele => { return ele.message }).join();
        throw new err(msg, 400)
    } else {
        next();
    }
}
app.post("/campgrounds", validate, handle(async (req, res) => {
    /**
     * Normally this level pf validation is required but still we have to take
     * care of pp l who might end making a wrong campground i.e missing data'
     * For this we use JOI 
     */

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)
}))
/**
 * Now this is a route to update a campground we use the post method
 */
app.put("/campgrounds/:id", validate, handle(async (req, res) => {
    // res.send("It worked");
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}))

app.delete("/campgrounds/:id", handle(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}))

/**
 * This is the error handlig code 
 * If there is an error we will hit this route;
 */
app.all("*", (req, res, next) => {
    console.log("Hello");
    next(new err("Page not found ", 404));
})

app.use((err, _req, res, _next) => {
    // res.send("Ohh man something went wrong");
    res.render("errors/error", { err })
})
/**=================================================================== */

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
