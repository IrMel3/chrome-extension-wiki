const express = require('express');
const cors = require('cors');
const Log = require("../schemas/loggerSchema");
const path = require('path');
const router = express.Router();

module.exports = app => {

app.get('/', function(req, res){
        console.log("Hi!")
      });

app.post('/addDictionaryEntry', (req, res) =>{
    let log = new Log({
        timestamp: req.body.timestamp,
        action: req.body.action,
        word: req.body.word,
        translation: req.body.translation
    })
    log.save()
        .then(() => res.send('Log saved!'))
        .catch(err => console.log(err))
    console.log(req.body);
})

}
