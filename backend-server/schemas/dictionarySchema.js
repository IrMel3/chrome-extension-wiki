const mongoose = require('mongoose')
const schema = mongoose.Schema

let dictionaryEntry = new schema({
    user: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    app: {
        type: String,
        required: false
    },
    term: {
        type: String,
        required: false
    },
    translation: {
        type: String,
        required: false
    },
    mothertounge: {
        type: String,
        required: false
    },
    targetlanguage: {
        type: String,
        required: false
    },
    link:{
        type: String,
        required: false
    }
})

const DictionaryEntry = mongoose.model("DictionaryEntry", dictionaryEntry)

module.exports = DictionaryEntry