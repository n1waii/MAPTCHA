const express = require("express");
var svgCaptcha = require('svg-captcha');

const app = express();

const FOODS = [
    "chicken", "donut", "fries", "hotdog", "pizza"
]


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


app.get("/captcha", (req, res) => {
    var captcha = svgCaptcha.create({
        fixedText: FOODS[Math.floor(Math.random()*FOODS.length)],
        noise: 10,
    });
	//req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha);
    
});


app.use(express.static("public"))
app.listen(3000, () => console.log("Example app is listening on port 3000."));
