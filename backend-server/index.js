const express = require('express')
const connectToDB = require('./db');
const Log = require("./schemas/loggerSchema");


const app = express()
const port = 3000
//const port = 10020

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*'); //website allowed to connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Request methods allowed
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //Request headers allowed
    next();
});

app.use(express.json({limit: '10MB'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
require('./routes/loggerRoutes.js') (app)
require('./routes/userRoutes.js') (app)
require('./routes/dictionaryRoutes.js')(app)

connectToDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})



