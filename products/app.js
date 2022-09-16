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

mongoose.connect("mongodb://localhost:27017/productsDB")




const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "No username was specified"],
        // match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: Profile }
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("user", userSchema)


const profileSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: User },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        unique: [true, "a profile with this email already exists"]
    }
})
const Profile = mongoose.model("profile", profileSchema)


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model("product", productSchema)

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "category already exists"]
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: Product }]
})

const Category = mongoose.model("category", categorySchema)


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
        if (!req.body.username || !req.body.password) {
            res.send("please enter the password and/or username")
        } else {
            let username = req.body.username
            let password = req.body.password

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
        }
    })


app.post("/changepassword", function (req, res) {
    if (req.isAuthenticated()) {
        User.findOne({ username: req.user.username }, function (err, user) {
            if (!err) {
                user.changePassword(req.body.oldpassword, req.body.newpassword, function (err) {
                    if (!err) {
                        res.send("password changed successfully")
                    } else {
                        res.send(err)
                    }
                })
            } else {
                res.send(err)
            }
        })
    } else {
        res.send("please log in first")
    }
})

app.get("/logout", function (req, res) {
    if (req.isAuthenticated()) {
        req.logOut();
        res.send("successfully logged out")
    } else {
        res.send("you are not logged in")
    }
})


app.route("/profile")
    .post(function (req, res) {
        if (req.isAuthenticated()) {
            User.findOne({ username: req.user.username }, '_id', function (err, userObjectId) {
                const profile = new Profile({
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email,
                    username: userObjectId
                })
                profile.save(function (err) {
                    if (err) {
                        res.send(err.message)
                    } else if (!err) {
                        res.send("profile created")
                    }
                })
            })
        } else {
            res.send("please log in first")
        }

    })
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            User.findOne({ username: req.user.username }, '_id', function (err, userObjectId) {
                Profile.findOne({ username: userObjectId })
                    .populate({ path: 'username' })
                    .then((result) => {
                        console.log(result)
                        res.send(result);
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    })
            })
        } else {
            res.send("please log in first")
        }
    })
    .patch(function (req, res) {
        // an error rises here if the signed-in user doesn't have a profile and tries to GET profile
        if (req.isAuthenticated()) {
            User.findOne({ username: req.user.username }, '_id', function (err, userObjectId) {
                Profile.updateOne(
                    { username: userObjectId },
                    { $set: { name: req.body.name, age: req.body.age, email: req.body.email } },
                    function (err) {
                        if (!err) {
                            res.send("profile updated successfully")
                        } else {
                            res.send(err)
                        }
                    }
                )
            })
        } else {
            res.send("please log in first")
        }
    })



app.route("/products")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            Category.find({}).populate({ path: "products" })
                .then((result) => {
                    console.log(result)
                    res.send(result);
                })
                .catch((error) => {
                    res.status(500).json({ error });
                })
        } else {
            res.send("please log in first")
        }
    })
    .post(function (req, res) {
        if (req.isAuthenticated()) {
            const product = new Product({
                name: req.body.name,
                price: req.body.price
            })
            product.save()
                .then((result) => {
                    Category.findOne({ name: req.body.category }, (err, category) => {
                        if (category) {
                            // The below two lines will add the newly saved product. 
                            category.products.push(product);
                            category.save();
                            res.send({ message: 'product created!' });
                        } else {
                            res.send("no such category found, please create a new category or enlist under a proper category")
                        }
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error });
                })
        } else {
            res.send("please log in first")
        }
    })
    .patch(function (req, res) {
        if (req.isAuthenticated()) {
            Product.updateOne(
                { name: req.body.name },
                { $set: { name: req.body.newname, price: req.body.price } },
                function (err) {
                    if (!err) {
                        res.send("product edited successfuly ")
                    } else {
                        res.send(err)
                    }
                }
            )
        } else {
            res.send("please log in first")
        }
    })
    .delete(function (req, res) {
        if (req.isAuthenticated()) {
            Product.deleteOne({ name: req.body.name }, function (err) {
                if (!err) {
                    res.send("product deleted successfuly ")
                } else {
                    res.send(err)
                }
            })
        } else {
            res.send("please log in first")
        }
    })


app.route("/category")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            Category.find({}, 'name', function (err, categories) {
                if (categories) {
                    if (!err) {
                        res.send(categories)
                    } else {
                        res.send(err)
                    }
                } else {
                    res.send("no categories found")
                }

            })
        } else {
            res.send("please log in first")
        }
    })
    .post(function (req, res) {
        if (req.isAuthenticated()) {
            const category = new Category({
                name: req.body.name
            })
            category.save(function (err) {
                if (err) {
                    res.send(err)
                } else {
                    res.send("category created successfully")
                }
            })
        } else {
            res.send("please log in first")
        }

    })
    .patch(function (req, res) {
        if (req.isAuthenticated()) {
            Category.updateOne(
                { name: req.body.oldname },
                { $set: { name: req.body.newname } },
                function (err) {
                    if (!err) {
                        res.send("category edited successfuly ")
                    } else {
                        res.send(err)
                    }
                }
            )
        } else {
            res.send("please log in first")
        }
    })
    .delete(function (req, res) {
        // we need to delete all of the products enlisted under a cateogry not just the category
        if (req.isAuthenticated()) {
            Category.deleteOne({ name: req.body.name }, function (err) {
                if (!err) {
                    res.send("category deleted successfuly ")
                } else {
                    res.send(err)
                }
            })
        } else {
            res.send("please log in first")
        }
    })


app.listen(3000, function () {
    console.log("server started on port 3000")
})
