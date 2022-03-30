const Sequelize = require('sequelize');
const connection = require('../../../../../database/database.js');
const User = require('../../admin/users/User.js');

const Enterprise = connection.define('enterprises', {
    corporateName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    corporateNameSlug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fantasyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fantasyNameSlug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foundationDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    CNPJ: {
        type: Sequelize.STRING(14),
        allowNull: false
    },
    stateRegistration: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    municipalRegistration: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    CEP: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    state: {
        type: Sequelize.STRING(2),
        allowNull: true
    },
    city: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    andress: {
        type: Sequelize.STRING,
        allowNull: true
    },
    andressComplement: {
        type: Sequelize.STRING,
        allowNull: true
    },
    district: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    andressNumber: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    telephone: {
        type: Sequelize.STRING(13),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    billingCEP: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    billingState: {
        type: Sequelize.STRING(2),
        allowNull: true
    },
    billingCity: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    billingAndress: {
        type: Sequelize.STRING,
        allowNull: true
    },
    billingAndressComplement: {
        type: Sequelize.STRING,
        allowNull: true
    },
    billingDistrict: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    billingAndressNumber: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    billingTelephone: {
        type: Sequelize.STRING(13),
        allowNull: true
    },
    billingEmail: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

Enterprise.belongsTo(User);
Enterprise.sync({ force: true });

module.exports = Enterprise;