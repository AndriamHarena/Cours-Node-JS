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
// require ('./src/routes/deleteMonument.route')(app)

// app.get('/monuments/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const monument = monuments.find(m => m.id === id)
//     const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
//     const data = monument
//     res.json({message, data})
// })

// app.get('/monuments', (req, res) => {
//     const message = 'La liste des monuments a bien été récupérée.'
//     const data = monuments
//     res.json({message, data})
// })

// app.post('/monuments', (req, res) => {
//     const id = 123
//     const monumentCreated = { ...req.body, ...{id: id, created: new Date()} }
//     monuments.push(monumentCreated)
//     const message = `Le monument avec l'id ${id} a bien été ajouté`
//     res.json({message, data: monumentCreated})
// })


// app.put('/monuments/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const monumentUpdated = { ...req.body, id: id }
//     monuments = monuments.map(m => {
//         return m.id === id ? monumentUpdated : m
//     })
//     const message = `Le monument avec l'id ${id} a bien été modifié.`
//     res.json({message, data: monumentUpdated})
// })


// app.delete('/monuments/:id', (req, res) => {    
//     const id = parseInt(req.params.id)
//     const monumentDeleted = monuments.find(m => m.id === id)
//     monuments = monuments.filter(m => m.id !== id)
    
//     const message = `Le monument avec l'id ${id} a bien été supprimé.`
//     res.json({message, data: monumentDeleted})
// })



app.listen(3000, () => console.log('Server running at http://localhost:3000'))
