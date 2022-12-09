const mongoose = require('mongoose')

/**
 * connection to mongoDB
 */

const dbMyURI = 'mongodb+srv://Iris:Iris123@loggingcluster.jhhec.mongodb.net/?retryWrites=true&w=majority'

const connectToDB = () => {
    mongoose.connect(dbMyURI)
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch(err => console.log(err))
}

module.exports = connectToDB