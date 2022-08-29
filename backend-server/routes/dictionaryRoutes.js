const express = require('express');
const cors = require('cors');
const Dictionary = require("../schemas/dictionarySchema");
const path = require('path');
const router = express.Router();

module.exports = app => {

app.get("/getDictionaryEntries", cors(), (req, res) => {
    let user = {user: req.query.user}
    Dictionary.find(user)
        .then(entries => {
        res.send(entries);
    }, err => console.error(err))
})


app.post("/addToDictionary", cors(), (req, res) => {
    let dictionary = new Dictionary({
        user: req.body.user,
        timestamp: req.body.timestamp,
        term: req.body.term,
        translation: req.body.translation,
        mothertounge: req.body.mothertounge,
        targetlanguage: req.body.targetlanguage,
        link: req.body.link
    })
    dictionary.save()
        .then(() => res.send('Entry saved!'))
        .catch(err => console.log(err))
    console.log(req.body);
})

app.delete("/deleteDictionaryEntry", cors(), (req, res) => {
    Dictionary.findOneAndDelete({_id: req.body.entry})
              .then(result => {
                if (result) {
                    res.send(result)
                }
                })
        .catch(err => console.log(err))
})
}