const Sequelize = require('sequelize');

const connection = new Sequelize('plena_db', 'root', 'Root123*', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;