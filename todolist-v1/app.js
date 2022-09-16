const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")


var items = ["apple", "cake", "sugar"];
var workItems = ["whoa", 'that', 'api'];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    let day = date.getDate();
    res.render("list", { kindOfDay: day, newListItems: items });
});


app.post("/", function (req, res) {
    var Item = req.body.newItem;
    if (req.body.list === "work") {
        workItems.push(Item);
        res.redirect("/work");
    } else {
        items.push(Item);
        res.redirect("/");
    }
});


app.get("/work", function (req, res) {

    res.render("list", { kindOfDay: "work List", newListItems: workItems });

});

app.get("/about", function (req, res) {
    res.render("about");
})


app.listen(3000, function () {
    console.log("server running on port 3000");
})