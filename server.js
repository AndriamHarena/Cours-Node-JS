const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const app = express()
const sequelize = require('./src/db/sequelize')
const auth = require('./src/auth/auth')

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
    .use(auth)
    

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.')
})

require ('./src/routes/findAllMonuments.route')(app)
require ('./src/routes/searchMonuments.route')(app)
require ('./src/routes/findMonumentByPK.route')(app)
require ('./src/routes/createMonument.route')(app)
require ('./src/routes/updateMonument.route')(app)
require ('./src/routes/deleteMonument.route')(app)
require ('./src/routes/login.route')(app)
require ('./src/routes/register.route')(app)
require ('./src/routes/refreshToken.route')(app)

app.use((req, res) => {
    const url = req.originalUrl
    const method = req.method
    const message = `La ressource demandée : "${method} ${url}" n'existe pas. Réessayez avec une autre URL.`
    res.status(404).json({ message, data: null })
})

app.listen(3000, () => console.log('Server running at http://localhost:3000'))
