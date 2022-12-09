const express = require('express');
const cors = require('cors');
const Dictionary = require("../schemas/dictionarySchema");
const path = require('path');
const router = express.Router();

/**
 * routes for all the dictionary actions  * 
 * @param {*} app 
 */

module.exports = app => {

/**
 * gets all the dictionary entries for a user from the database
 */
app.get("/getDictionaryEntries", cors(), (req, res) => {
    let user = {user: req.query.user}
    Dictionary.find(user)
        .then(entries => {
        res.send(entries);
    }, err => console.error(err))
})

/**
 * adds a vocabulary entriy to the database for the specific user
 */
app.post("/addToDictionary", cors(), (req, res) => {
    let dictionary = new Dictionary({
        user: req.body.user,
        timestamp: req.body.timestamp,
        app: req.body.app,
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

/**
 * deletes a dictionary entry from the database
 */
app.delete("/deleteDictionaryEntry", cors(), (req, res) => {
    console.log(req.body);
    let dbFilter = {user: req.body.user, term: req.body.term, translation: req.body.translation}
    console.log(dbFilter);
    Dictionary.findOneAndDelete(dbFilter)
              .then(result => {
                if (result) {
                    res.send(result)
                }
                })
        .catch(err => console.log(err))
})
}