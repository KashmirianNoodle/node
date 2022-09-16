const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/mangoDB")

const app = express();
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




const favMovieSchema = new mongoose.Schema({
    username: String,
    movieName: String
})
const FavMovie = mongoose.model("FavMovie", favMovieSchema)




const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    firstname: String,
    lastName: String,
    favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: FavMovie }]

})
const User = mongoose.model("User", userSchema)





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


app.post("/movies", function (req, res) {
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
    User.findOne({ username: req.body.username }, '_id', function (err, userObjectId) {
        const rating = new Rating({
            rating: req.body.rating,
            postedBy: userObjectId
        })
        rating.save()
            .then((result) => {
                Movie.findOne({ movieName: req.body.movieName }, (err, movie) => {
                    if (movie) {
                        // The below two lines will add the newly saved favmovie(s) 
                        // ObjectID to the the User's favMovie array field
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
})

app.post("/mobbbbbbbies", function (req, res) {
    const movies = req.body.movies
    if (movies.length > 0) {
        let failureCount = 0;
        for (let movie of movies) {
            let newMovie = new Movie({
                movieName: movie.name,
                genre: movie.genre
            })
            newMovie.save(function (err) {
                if (err) {
                    failureCount++
                }
            })
        }
        if (failureCount > 0)
            res.send("Failed to add " + failureCount + " movie(s) due to some error")
        else
            res.send("Movie(s) added successfully ")
    }
})


app.get("/getuserRatings", function (req, res) {
    Rating.findOne({ '_id': '627e822d5fe735410400e2e2' })
        .populate({ path: 'postedBy' })
        .then((result) => {
            console.log(result)
            res.send(result);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
})

//     const rating = new Rating({
//         rating: req.body.rating,
//         // postedBy: postedBy
//     })
//     rating.save()
//         .then((result) => {
//             Movie.findOne({ movieName: req.body.movieName }, (err, movie) => {
//                 if (movie) {
//                     // The below two lines will add the newly saved favmovie(s) 
//                     // ObjectID to the the User's favMovie array field
//                     movie.ratings.push(rating);
//                     movie.save();
//                     res.send({ message: 'rating created!' });
//                 }
//             });
//         })
//         .catch((error) => {
//             res.status(500).json({ error });
//         });
// })

// app.post("/ratings", function (req, res) {

// })


app.post("/userid", function (req, res) {

})









app.post("/login", function (req, res) {

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.send("user created ")
        }
    })
})

app.post("/favMovies", function (req, res) {
    const username = req.body.username
    const movieName = req.body.movieName

    const movie = new FavMovie({
        username: username,
        movieName: movieName
    })
    console.log(movie)
    movie.save()
        .then((result) => {
            User.findOne({ username: req.body.username }, (err, user) => {
                if (user) {
                    // The below two lines will add the newly saved favmovie(s) 
                    // ObjectID to the the User's favMovie array field
                    user.favouriteMovies.push(movie);
                    user.save();
                    res.json({ message: 'movie created!' });
                }
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
})

app.get('/favMovies', function (req, res) {
    User.findOne({ username: "1234@gmail.com" })
        .populate({ path: 'favouriteMovies' })
        .then((result) => {
            res.send(result.favouriteMovies);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
})

app.get("/users", function (req, res) {
    User.find({}, function (err, user) {
        if (!err) {
            if (user) {
                res.send(user)
            } else {
                res.send("no such user found")
            }
        } else {
            res.send(err)
        }
    })
})



// app.post("/profile", function (req, res) {

//     const profileData = {
//         age: req.body.age,
//         name: req.body.name,
//         userid: "627ddfa652544eab8e8a904e"

//         // username or userid must be the guy who is logged in 
//     }
//     console.log(profileData)
//     newProfile = new Profile(profileData)
//     newProfile.save(function (err) {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send("profile created ")
//         }
//     })
//     // if (!ObjectId.isValid(profileData.username)) {
//     //     throw new Error("author object id not passed")
//     // }

// })

// app.get("/profile", function (req, res) {
//     User.findOne({ username: "123@gmail.com" }).populate({ path: 'favouriteMovies' }).exec(function (err, result) {
//         if (err) {
//             res.status(400).send(err)
//         } else {
//             // result.favouriteMovies.forEach(function (movie) {
//             //     console.log(movie.movieName)
//             // })
//             res.status(200).json(result.favouriteMovies)
//         }
//     })
// })






app.listen(3000, function () {
    console.log("server started on port 3000")
})






// const john = new User({
//     username: "john@gmail.com",
//     age: 34,
//     name: "john"
// })


// john.save(function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("Person created successfully")
//     }
// });



// const pulpfiction = new Movie({
//     movieName: "pulpfiction",
//     genre: "drama"
// })

// pulpfiction.save(function (err) {
    // if (err) {
    //     console.log(err)
    // } else {
    //     console.log("movie created successfully")
    // }
// })

// const newRating = new Rating({
//     rating: 18,
//     movieName: "pulpfiction",
// })