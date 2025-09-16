const { MonumentModel } = require('../db/sequelize');

module.exports = (app) => {
    app.put('/monuments/:id', (req, res) => {
        const id = parseInt(req.params.id);
        MonumentModel.update(req.body, {
            where: { id: id }
        })
        .then(_ => {
            return MonumentModel.findByPk(id).then(monument => {
                if(monument === null){
                    const message = `Le monument avec l'ID ${id} n'existe pas.`
                    return res.status(404).json({message, data: null})
                }
                const message = `Le monument avec l'ID ${id} a bien été mis à jour.`
                res.json({message, data: monument})
            })
        })
        .catch(error => {
            if(error.name === "SequelizeValidationError"){  
                const validationErrors = error.errors.map(e => e.message);
                const message = "Le monument n'a pas pu être modifié. Vérifiez les informations saisies.";
                return res.status(400).json({ message, data: validationErrors });
            }
            const message = "Le monument n'a pas pu être mis à jour. Réessayez dans quelques instants."
            return res.status(500).json({ message, data: error })
        });
    });
}   