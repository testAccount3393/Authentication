//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
var md5 = require('md5');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

// const userSchema = {
//     email: String,
//     password: String
// };

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save().then(() => {
            res.render("secrets");
        }).catch((error) => {
            console.log(error);
        });
    });

    
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((foundUser) => {
        if(foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result === true) {
                    res.render("secrets");
                }
            });
        }
    }).catch((error) => {
        console.log(error);
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});