const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const svgCaptcha = require('svg-captcha');
const bodyParser = require("body-parser");
const ExperimentData = require("./model/experimentData.js");

const dbURL = "mongodb+srv://nigamdahal:" + process.env.DBPASS + "@cluster0.wjz3e6f.mongodb.net/?retryWrites=true&w=majority";
const app = express();


mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected to db");
        app.listen(process.env.PORT || 3000, () => console.log("Example app is listening on port 3000."));
    })
    .catch((err) => console.log(err));

 
 
var jsonParser = bodyParser.json()

app.use(cookieParser());

const FOODS = [
    "chicken", "donut", "fries", "hotdog", "pizza"
]

app.get("/", (req, res) => {
    var cookie = req.cookies.completed;
    console.log(cookie);
    if (cookie === undefined) {
        res.sendFile(__dirname + "/public/index.html");
    } else {
        res.send("Thank you for completing the challenge.")
    }
    //res.cookie('completed', 'true').send('cookie set')
   // res.sendFile(__dirname + "/public/index.html");
});

app.get("/complete", (req, res) => {
	res.cookie("completed", "true").send("Thank you for completing the challenge.") 
});

app.post("/add-data", jsonParser, (req, res) => {
    const data = req.body;

	const experimentData = new ExperimentData({
        TotalClicks: data.TotalClicks,
        CorrectClicks: data.CorrectClicks,
        AvgMouseDist: data.AvgMouseDist,
        AvgTime: data.AvgTime,
        TotalTime: data.TotalTime,
        TotalColls: data.TotalColls
    });

    experimentData.save()
        .then((result) => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});



app.get("/captcha", (req, res) => {
    var captcha = svgCaptcha.create({
        fixedText: FOODS[Math.floor(Math.random()*FOODS.length)],
        noise: 15,
    });
	//req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha);
    
});


app.use(express.static("public"))
