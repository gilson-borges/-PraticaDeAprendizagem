const Sequelize = require('sequelize');
const connection = require('../../../../../database/database.js');

const User = connection.define('users', {
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    permissions: {
        type: Sequelize.JSON,
        allowNull: false
    }
})

User.sync({ force: false });

module.exports = User;