const { MonumentModel } = require('../db/sequelize');

module.exports = (app) => {
    app.post('/monuments', (req, res) => {
        MonumentModel.create(req.body)
            .then(monument => {
                const message = `Le monument avec ${monument.title} a bien été crée.`
                res.json({message, data: monument})
            })
            .catch(error => {
                const message = `Une erreur s'est produite lors de la création du monument : ${error}`
                res.status(500).json({message, data: null})
            });
    });
};