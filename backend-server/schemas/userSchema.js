const mongoose = require('mongoose')
const schema = mongoose.Schema

let user = new schema({
    user: {
        type: String,
        required: true
    }
    
})

const User = mongoose.model("User", user)

module.exports = User