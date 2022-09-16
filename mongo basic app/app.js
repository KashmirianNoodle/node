// connecting to the mongodb server
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/People_fruits_DB");

//Creating Schemas for our Models aka collections
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please check your data entry, no name has been specified"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

const personSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
})

// Creating Models aka Collections (called tables incase of SQL )for our database
const Fruit = mongoose.model("Fruit", fruitSchema);
const Person = mongoose.model("Person", personSchema);

// DATA CREATION
const pineapple = new Fruit({
    name: "pineapple",
    rating: 8,
    review: "pineapples are great, hard to crack tho xD"
});

// pineapple.save(function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("pineapple created successfully")
//     }
// });

const apple = new Fruit({
    name: "Apple",
    rating: 9,
    review: "An apple a day keeps the doctor away"
});
const kiwi = new Fruit({
    name: "kiwi",
    rating: 6,
    review: "rather healthy, but expensive lol"
});
const banana = new Fruit({
    name: "banana",
    rating: 8,
    review: "favorite fruit, i'll tell you that much"
});
const orange = new Fruit({
    name: "orange",
    rating: 5,
    review: "sour, healthy but idk about oranges"
});

const peach = new Fruit({
    rating: 6,
    review: "i don't know any peaches, never seen one lol"
})
//DATA INSERTION {JUST ONE DOCUMENT} (before putting in Data validation for {name} field)
// peach.save()

const sultan = new Person({
    _id: 1,
    name: "sultan",
    age: 56
})
const shom = new Person({
    _id: 2,
    name: "Shom",
    age: 13
})
const person = new Person({
    _id: 3,
    name: "john",
    age: 45,
    favouriteFruit: pineapple
})
// person.save(function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("Person created successfully")
//     }
// });

// DATA INSERTION
/* Fruit.insertMany([apple, kiwi, banana, orange], function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("successfully inserted the fruits")
    }
}) */

// Person.insertMany([sultan,shom], function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("successfully inserted the people")
//     }
// })



// DATA READING
Fruit.find(function (err, fruits) {
    if (err) {
        console.log(err)
    } else {
        fruits.forEach(function (item, index) {
            console.log(item.name);
        })
    }
})

//DATA UPDATE

/* Fruit.updateOne({ _id: "617504c2768bcfe68bbe1390" }, { name: "Peach" }, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("document updated successfully")
    }
}) */

//DATE UPDATE 2 [giving sultan an embedded document]
// Person.updateOne({ name: "sultan" }, { favouriteFruit: apple }, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("sultan given an embedded apple successfully")
//     }
// })


//DATA DELETION
// Fruit.deleteOne({ _id: "617504c2768bcfe68bbe1390" }, function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("document deleted successfully")
//     }
// })

