module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Le nom d\'utilisateur est obligatoire.'
            },
            notEmpty: {
                msg: 'Le nom d\'utilisateur est obligatoire.'
            },
            len: {
                args: [3, 25],
                msg: 'Le nom d\'utilisateur doit contenir entre 3 et 25 caractères.'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Le mot de passe est obligatoire.'
            },
            notEmpty: {
                msg: 'Le mot de passe est obligatoire.'
            },
            len: {
                args: [6, 100],
                msg: 'Le mot de passe doit contenir entre 6 et 100 caractères.'
            }
        }
    }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
    });
}