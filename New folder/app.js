const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/movieDB")




const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please check the data entry, no email was specified"],
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        index: {
            unique: true
        },
        unique: true
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
    failedAttempts: Number
})
const options = { attemptsField: "failedAttempts", limitAttempts: true, maxAttempts: 5, unlockInterval: 30000 }
userSchema.plugin(passportLocalMongoose, options);
// include options above to lock account
const User = mongoose.model("user", userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





const ratingSchema = new mongoose.Schema({
    rating: Number,
    // movieName: { type: mongoose.Schema.Types.ObjectId, ref: movieSchema },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
})
const Rating = mongoose.model("rating", ratingSchema)


const movieSchema = new mongoose.Schema({
    movieName: String,
    genre: String,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: Rating }]
})
const Movie = mongoose.model("movie", movieSchema)



// const ratingSchema = new mongoose.Schema({
//     username: userSchema,
//     movie: {
//         String,
//         required: [true, "please check the data entry, no movie name specified"]
//     },
//     rating: {
//         type: Number,
//         require: [true, "please enter a corresponding rating for the movie"],
//         min: [1, "a movie rating must be in between 1 and 5"],
//         max: [5, "a movie rating must be in between 1 and 5"]
//     }
// });




app.route("/signup")
    .post(function (req, res) {
        let username = req.body.username
        let password = req.body.password
        User.register({ username }, password, function (err) {
            if (err) {
                console.log(err);
                res.send(err.message);
            }
            else {
                res.send("Registered successfully!")
            }
        })
    })

app.route("/login")
    .post(function (req, res) {
        let username = req.body.username
        let password = req.body.password


        // const authenticate = User.authenticate();
        // authenticate(username, password, function (err, result, msg) {
        //     if (err) { console.log(err) }
        //     else if (!result) { res.send(msg.message) }
        //     else {
        //         res.send("successfully logged in ")
        //         passport.authenticate("local")(req, res, function () { })
        //     }
        // });

        const user = new User({
            username: username,
            password: password
        })

        req.login(user, function (err) {
            if (err) {
                console.log(err)
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.send("successfully logged in ")
                })
            }
        })
    })


app.get("/logout", function (req, res) {
    req.logOut();
    res.send("succesfully logged out")
})


// app.route("/providebasicinfoandlistofmovieswithratings") here we we will save his list of favoirite movies in movie database we could use an array of key value pairs to accept movie and corresponding rating. then save it to the movie database
// nvm we could just accept multiple movies as a post request to /movies and loop through the body to save all the movies and their corresponding ratings.

app.route("/movies")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            console.log(req.user)
            Movie.find({}, function (err, foundMovies) {
                if (!err) {
                    res.json(foundMovies)
                } else {
                    res.send(err)
                }
            })
        } else {
            res.send('please log in first')
        }
    })
    .post(function (req, res) {
        if (req.isAuthenticated()) {
            const movie = new Movie({
                movieName: req.body.movieName,
            })
            movie.save(function (err) {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log("movie created ")
                }
            })
            // we need to check req.user 
            User.findOne({ username: req.user.username }, '_id', function (err, userObjectId) {
                const rating = new Rating({
                    rating: req.body.rating,
                    postedBy: userObjectId
                })
                rating.save()
                    .then((result) => {
                        Movie.findOne({ movieName: req.body.movieName }, (err, movie) => {
                            if (movie) {
                                // The below two lines will add the newly saved movie(s) 
                                movie.ratings.push(rating);
                                movie.save();
                                res.send({ message: 'rating created!' });
                            }
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
            })

            // const movies = req.body.movies
            // //const rating = req.body.rating
            // // we must calculate avg rating not accept it from the user
            // //const genre = req.body.genre
            // if (movies.length > 0) {
            //     let failureCount = 0;
            //     for (let movie of movies) {
            //         let newMovie = new Movie({
            //             name: movie.name,
            //             rating: movie.rating,
            //             genre: movie.genre
            //         })
            //         newMovie.save(function (err) {
            //             if (err) {
            //                 failureCount++
            //             }
            //         })
            //     }
            //     if (failureCount > 0)
            //         res.send("Failed to add " + failureCount + " movie(s) due to some error")
            //     else
            //         res.send("Movie(s) added successfully ")
            // }
        } else {
            res.send("please log in first")
        }
    })
// .delete(function (req, res) {
//     Movie.deleteMany({}, function (err) {
//         if (!err) {
//             res.send("all movies deleted successfully ")
//         } else {
//             res.send(err)
//         }
//     })
// })


app.route("/movies/:movieName")
    .get(function (req, res) {
        // Movie.findOne({ name: req.params.movieName }, function (err, foundMovie) {
        //     if (!err) {
        //         if (foundMovie) {
        //             //calculate av of foundMovie.ratings then send the rating
        //             console.log(foundMovie.ratin)
        //             res.send(foundMovie)
        //         } else {
        //             res.send("no such movie found")
        //             // here we should return relevant movies (maybe find same genre movies in db)
        //         }
        //     } else {
        //         res.send(err)
        //     }
        // })
        Movie.findOne({ movieName: req.params.movieName })
            .populate({ path: 'ratings' })
            .then((result) => {
                console.log(result.ratings)
                res.send(result.ratings);
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    })
    .patch(function (req, res) {
        // Movie.updateOne(
        //     { name: req.params.movieName },
        //     { $set: { rating: req.body.rating } },
        //     function (err) {
        //         if (!err) {
        //             res.send("movie updated successfully")
        //         } else {
        //             res.send(err)
        //         }
        //     }
        // )
    })

app.get("/getuserRatings", function (req, res) {
    if (req.isAuthenticated()) {
        User.findOne({ username: req.user.username }, '_id', function (err, userObjectId) {
            console.log(userObjectId)
            Rating.find({ 'postedBy': userObjectId })
                // .populate({ path: 'postedBy' })
                .then((result) => {
                    console.log(result)
                    res.send(result);
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
        })
    } else {
        res.send("please log in first")
    }
})



app.listen(3000, function () {
    console.log("server started on port 3000")
})


