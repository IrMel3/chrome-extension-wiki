const mongoose = require('mongoose')
const schema = mongoose.Schema

let log = new schema({
    timestamp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    word: {
        type: String,
        required: false
    },
    translation: {
        type: String,
        required: false
    }
})

const Log = mongoose.model("Log", log)

module.exports = Log