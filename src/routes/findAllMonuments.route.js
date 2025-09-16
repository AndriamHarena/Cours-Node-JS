const {MonumentModel} = require('../db/sequelize');
module.exports = (app) => {
    app.get('/monuments', (req, res) => {
        MonumentModel.findAll()
        .then(monuments => {
            const message = 'La liste des monuments a bien été récupérée.'
            res.json({message, data: monuments})
        })
        .catch(error => {
            const message = `Une erreur s'est produite lors de la recherche des monuments : ${error}`
            res.status(500).json({message, data: null})
        });
    });
}