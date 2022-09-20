const mongoose = require('mongoose')
const schema = mongoose.Schema

let log = new schema({
    user: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    app:{
        type: String,
        required: false
    },
    word: {
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
    }
})

const Log = mongoose.model("Log", log)

module.exports = Log