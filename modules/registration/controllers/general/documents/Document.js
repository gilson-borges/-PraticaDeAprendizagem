const Sequelize = require('sequelize');
const connection = require('../../../../../database/database.js');

const Document = connection.define('documents', {
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accountingDocument: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowDeletionPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    blokRepeatNumberingPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowOnlyAdvance: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowReceiving: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowDeletionReceiving: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    blokRepeatNumberingReceiving: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    requiredRegisterUnit: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    fiscalDocument: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

Document.sync({ force: false });

module.exports = Document;