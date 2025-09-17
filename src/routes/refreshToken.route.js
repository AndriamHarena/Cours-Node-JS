const { UserModel } = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/refresh-token', async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ 
                message: "Le refresh token est requis", 
                data: null 
            });
        }

        try {
            const user = await UserModel.findOne({ 
                where: { refreshToken } 
            });

            if (!user) {
                return res.status(401).json({ 
                    message: "Refresh token invalide", 
                    data: null 
                });
            }

            const now = new Date();
            if (user.refreshTokenExpiry < now) {
                await user.update({
                    refreshToken: null,
                    refreshTokenExpiry: null
                });

                return res.status(401).json({ 
                    message: "Refresh token expiré. Veuillez vous reconnecter.", 
                    data: null 
                });
            }

            const newAccessToken = jwt.sign(
                { userName: user.username, userId: user.id }, 
                privateKey, 
                { algorithm: 'RS256', expiresIn: '1m' }
            );

            return res.json({ 
                message: "Access token renouvelé avec succès", 
                data: { 
                    userId: user.id,
                    accessToken: newAccessToken,
                    accessTokenExpiresIn: '1m'
                } 
            });

        } catch (error) {
            const message = 'Erreur lors du renouvellement du token';
            return handleError(res, error, message);
        }
    });
};