const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const user_routes = require('./routes/user')
const animal_routes = require('./routes/animal')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Headers
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Requested-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
});

app.use('/api/v1', user_routes)
app.use('/api/v1', animal_routes)

module.exports = app
