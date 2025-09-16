const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const app = express()
const sequelize = require('./src/db/sequelize')

function nightBlocker (req, res, next){
    const hour = new Date().getHours();
    if(hour >= 0 && hour < 6 ){
        res.status(503).json({message: "Le serveur est en cours de maintenance", data: null})
    }else{
        next();
    }
}

sequelize.initDb()

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(nightBlocker)
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan("dev"))
    

app.get('/', (req, res) => {
    res.send('Hello, Express !')
})

require ('./src/routes/findAllMonuments.route')(app)
require ('./src/routes/findMonumentByPK.route')(app)
require ('./src/routes/createMonument.route')(app)
require ('./src/routes/updateMonument.route')(app)
require ('./src/routes/deleteMonument.route')(app)

app.listen(3000, () => console.log('Server running at http://localhost:3000'))
