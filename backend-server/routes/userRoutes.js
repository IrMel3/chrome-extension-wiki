const express = require('express');
const cors = require('cors');
const User = require("../schemas/userSchema");
const path = require('path');
const router = express.Router();

module.exports = app => {

app.post("/loginUser", cors(), (req, res) => {
    let user = req.body.user
    User.findOne({user: user}, function(err, foundUser){
        if(!foundUser){
            res.json({message: "User does not exist. Please register first."})
        } else{
            if(foundUser){
                res.json({ message: "User exists!" })
            }
        }
    })
})

app.post("/registerUser", cors(), (req, res) => {
    let user = new User({
        user: req.body.user
    })
    User.findOne({user: user}, function(err, foundUser){
        if(foundUser){
            res.json({message: "User already exists! Choose another name." });
        }else{
            user.save()
            .then(res.json({message:"Saved new user!"}))
            .catch(error => console.log(error))
        }
    })
})
}