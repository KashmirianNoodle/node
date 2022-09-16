const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.post("/", function (request, response) {
    var num1 = Number(request.body.num1);
    var num2 = Number(request.body.num2);
    var result = num1 + num2
    response.send("the result is" + result);
})


app.get("/bmi", function (req, res) {
    res.sendFile(__dirname + "/bmi.html");
})

app.post("/bmi", function (req, res) {
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    var bmi = weight / (height * height);
    res.send("your bmi is: " + bmi)
})

app.get("/weather", function (req, res) {
    res.sendFile(__dirname + "/weather.html")
})


app.post("/weather", function (req, res) {
    const query = req.body.cityName
    const apiKey = "dd87a222efeb7e708b85847c046e3aab"
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit

    https.get(url, function (response) {

        response.on("data", function (data) {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description
            console.log(temp, weatherDescription);
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<p> the temperature in " + query + " currently is: " + temp + " degree celcius <p>")
            res.write("<h1> the Weather is currently :" + weatherDescription + "</h1>")
            res.write("<img src =" + imageURL + ">")
            res.send();
        })
    })
})



app.listen(3000, function () {
    console.log("server running on port 3000");
});
