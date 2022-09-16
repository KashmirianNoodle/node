const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/newDB")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please check the data entry, no email was specified"],
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        // required: [true, "please check the data entry, no  password was specified"],
        // match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        // minlength: 8
    },
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    name: String,
    age: Number,
})


userSchema.plugin(passportLocalMongoose);
// include options above to lock account
const User = mongoose.model("user", userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route("/signup")
    .post(function (req, res) {
        User.register({ username: req.body.email }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log("after this we authenticate")
                passport.authenticate("local")(req, res, function () {
                    res.send("registered successfully,you are now logged in")
                })
            }
        })
    })


app.listen(3000, function () {
    console.log("server started on port 3000")
})


