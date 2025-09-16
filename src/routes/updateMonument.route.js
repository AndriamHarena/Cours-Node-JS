const {MonumentModel} = require('../db/sequelize');

module.exports = (app) => {
    app.put('/monuments/:id', (req, res) => {
        const id = parseInt(req.params.id);
        MonumentModel.update(req.body, {
            where: {id: id}
        })
        .then(_ => {
            return MonumentModel.findByPk(id).then(monument => {
                if (monument === null) {
                    const message = `Le monument avec l'ID ${id} n'existe pas.`;
                    return res.status(404).json({ message, data: null });
                }

                const message = `Le monument avec l'id ${id} a bien été modifié.`;
                res.json({ message, data: monument });
            });
        })
        .catch(error => {
            const message = `Une erreur s'est produite lors de la recherche du monument : ${error}`;
            res.status(500).json({ message, data: null });
        });
    });
};