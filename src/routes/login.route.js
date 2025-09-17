const { UserModel } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const privateKey = fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../helper');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: "Trop de tentatives de connexion. Veuillez essayer plus tard."
});

module.exports = (app) => {
    app.post('/login', loginLimiter, async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Le nom d'utilisateur et le mot de passe sont requis", 
                data: null 
            });
        }

        try {
            // Vérification si l'utilisateur existe
            const user = await UserModel.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé", data: null });
            }

            // Vérification du mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Mot de passe incorrect", data: null });
            }

            // Génération de l'access token (1 minute)
            const accessToken = jwt.sign(
                { userName: user.username, userId: user.id }, 
                privateKey, 
                { algorithm: 'RS256', expiresIn: '1m' }
            );

            // Génération du refresh token (7 jours)
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 jours

            // Mise à jour de l'utilisateur avec le refresh token
            await user.update({
                refreshToken: refreshToken,
                refreshTokenExpiry: refreshTokenExpiry
            });

            return res.json({ 
                message: "Authentification réussie", 
                data: { 
                    userId: user.id, 
                    accessToken,
                    refreshToken,
                    accessTokenExpiresIn: '1m',
                    refreshTokenExpiresIn: '7d'
                } 
            });

        } catch (error) {
            message = 'Erreur lors de l\'authentification'
            return handleError(res, error, message);
        }
    });
};
