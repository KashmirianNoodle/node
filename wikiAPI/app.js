const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const ejs = require("ejs")

const app = express();
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


mongoose.connect("mongodb://localhost:27017/wikiDB")

const wikiSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", wikiSchema)



app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.json(foundArticles)
            } else {
                res.send(err)
            }
        })
    })
    .post(function (req, res) {
        const title = req.body.title
        const content = req.body.content

        const newArticle = new Article({
            title: title,
            content: content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("article inserted succesfully ")
            } else {
                res.send(err)
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("articles deleted succesfully ")
            } else {
                res.send(err)
            }
        })
    });


app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (!err) {
                if (foundArticle) {
                    res.send(foundArticle)
                } else {
                    res.send("no such document found")
                }
            } else {
                res.send(err)
            }
        })
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: { title: req.body.title, content: req.body.content } },
            { overwrite: true },
            function (err, docs) {
                if (!err) {
                    res.send("article updated successfully")
                } else {
                    res.send(err)
                }
            })
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("article updated successfully")
                } else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("article deleted successfully")
                } else {
                    res.send(err)
                }
            })
    })

app.listen(3000, function () {
    console.log("server started on port 3000")
})


// const item1 = new Article({
//     title: 'jQuery',
//     content: "really solid front end framework for javascript"
// })
// const item2 = new Article({
//     title: 'React',
//     content: "really solid front end framework"
// })
// const item3 = new Article({
//     title: 'Angular',
//     content: "really solid front end framework"
// })

// item1.save()
// item2.save()
// item3.save()
