const express = require("express");
const cookieParser = require('cookie-parser');
const svgCaptcha = require('svg-captcha');

const app = express();

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
app.listen(3000, () => console.log("Example app is listening on port 3000."));
