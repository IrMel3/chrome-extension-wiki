const express = require('express');
const cors = require('cors');
const User = require("../schemas/userSchema");

module.exports = app => {

app.post("/loginUser", cors(), (req, res) => {
    let user = req.body.user
    User.findOne({"user": user}, function(err, foundUser){
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
    const user = req.body.user;
    const newUser = new User({
        user: req.body.user
    })
    User.findOne({"user": user}, function(err, foundUser){
        if(foundUser){
            res.json({message: "User already exists! Choose another name." });
        }else{
            newUser.save()
            .then(res.json({message:"Saved new user!"}))
            .catch(error => console.log(error))
        }
    })
})
}