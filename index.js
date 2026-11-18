const express = require('express')
const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config()

const app = express()
app.use(passport.initialize())

const {CLIENT_ID , CLIENT_SECRET} = process.env

console.log(CLIENT_ID , CLIENT_SECRET)

passport.use(
    new GoogleStrategy(
    {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3001/callback",
    },
    (accessToken, refreshToken, profile, next) => {
    console.log("Access token", accessToken);
    console.log("Profile", profile);
    next(null, profile);
    }
    )
);

let user;

app.get("/", (req, res) => {
    res.send("<button> <a href='/login'>Login withGoogle</a> </button>");
});

app.get(
    "/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/callback",
    passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
    }),
    (req, res) => {
    user = req.user;
    res.redirect("/profile");
}
);
app.get("/profile", (req, res) => {
    res.send(user);
});

app.listen(3001 ,() => {
    console.log("Server is running on port 3001")
})