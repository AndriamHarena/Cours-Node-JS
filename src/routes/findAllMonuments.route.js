const { MonumentModel } = require('../db/sequelize')
const { Op } = require('sequelize');

module.exports = (app) => {
    app.get('/monuments', (req, res) => {
        if(req.query.title){
            const { title, limit, orderBy } = req.query;

            MonumentModel.findAll({
                where: {
                    title: {
                        [Op.like]: `%${title}%`
                    }
                },
                limit: parseInt(limit) || undefined,
                order: orderBy ? [[orderBy, 'ASC']] : undefined
            })
                .then(monuments => {
                    if(monuments.length === 0){
                        const message = `Aucun monument avec le nom ${title} n'a été trouvé.`
                        return res.status(404).json({ message, data: null })
                    }
                    const message = `Les monuments avec le nom ${title} ont bien été trouvés.`
                    res.json({ message, data: monuments })
                })
                .catch(error => {
                    const message = "La liste des monuments n'a pas pu être récupérée. Réessayez dans quelques instants."
                    return res.status(500).json({ message, data: error })
                });

        }else{

            MonumentModel.findAll()
                .then(monuments => {
                    const message = 'La liste des monuments a bien été récupérée.'
                    res.json({ message, data: monuments })
                })
                .catch(error => {
                    const message = "La liste des monuments n'a pas pu être récupérée. Réessayez dans quelques instants."
                    return res.status(500).json({ message, data: error })
                });
        }

    });
}