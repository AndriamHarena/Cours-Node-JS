const { MonumentModel } = require('../db/sequelize');
const { Op } = require('sequelize');

module.exports = (app) => {
    app.get('/monuments/search', (req, res) => {
        const { q, limit, offset, order } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                message: "Le terme de recherche doit contenir au moins 2 caractères.",
                data: null
            });
        }

        const searchTerm = q.trim();
        const limitValue = limit ? parseInt(limit) || undefined : undefined;
        const offsetValue = offset ? parseInt(offset) || 0 : 0;
        const orderDirection = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

        MonumentModel.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    }
                ]
            },
            limit: limitValue,
            offset: offsetValue,
            order: [['title', orderDirection]]
        })
        .then(monuments => {
            if (monuments.length === 0) {
                const message = `Aucun monument trouvé avec le terme de recherche "${searchTerm}".`;
                return res.status(404).json({ message, data: null });
            }
            
            const message = `${monuments.length} monument(s) trouvé(s) avec le terme de recherche "${searchTerm}".`;
            res.json({ message, data: monuments });
        })
        .catch(error => {
            const message = `Une erreur s'est produite lors de la recherche du monument : ${error.message}`;
            return res.status(500).json({ message, data: null });
        });
    });
}