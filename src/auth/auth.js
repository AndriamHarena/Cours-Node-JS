const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const publicKey = fs.readFileSync(path.join(__dirname, '../auth/jwtRS256.key.pub'));

module.exports = (req, res, next) => {

    if (req.path === '/login') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            message: 'Token d\'authentification manquant.',
            data: null
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Token d\'authentification manquant.',
            data: null
        });
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Token d\'authentification invalide ou expiré.',
                data: null
            });
        }
        req.user = user;
        next();
    });
};