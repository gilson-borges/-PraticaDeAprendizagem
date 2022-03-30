const express = require('express');
const router = express.Router();

//#region PERMISSIONS MIDDLEWARES
const userAuth = require('../../middlewares/userAuth');
const adminAuth = require('../../middlewares/adminAuth')
const registrationAuth = require('../../middlewares/registrationAuth')

//#region IMPORT CONTROLLERS

// ADMIN PERMISSION
const UsersController = require('./controllers/admin/users/users');

// GENERAL PERMISSION
const BankAccountsController = require('./controllers/general/bankAccounts');
const BanksController = require('./controllers/general/banks');
const BuildingsController = require('./controllers/general/buildings');
const CreditorsController = require('./controllers/general/creditors');
const CustomersController = require('./controllers/general/customers');
const DocumentsController = require('./controllers/general/documents/documents.js');
const EnterprisesController = require('./controllers/general/enterprises/enterprises.js');
const FinancialPlansController = require('./controllers/general/financialPlans');
const IndexersController = require('./controllers/general/indexers');
const InputsController = require('./controllers/general/inputs');
const ModelsController = require('./controllers/general/models');
const UnitsController = require('./controllers/general/units');

//#endregion

//#region USE CONTROLLERS

// ADMIN PERMISSION
router.use('/usuarios', UsersController);

// GENERAL PERMISSION
router.use('/contas-bancarias', registrationAuth, BankAccountsController);
router.use('/bancos', registrationAuth, BanksController);
router.use('/obras', registrationAuth, BuildingsController);
router.use('/credores', registrationAuth, CreditorsController);
router.use('/clientes', registrationAuth, CustomersController);
router.use('/documentos', DocumentsController);
router.use('/empresas', EnterprisesController);
router.use('/planos-financeiros', registrationAuth, FinancialPlansController);
router.use('/indexadores', registrationAuth, IndexersController);
router.use('/insumos', registrationAuth, InputsController);
router.use('/modelos', registrationAuth, ModelsController);
router.use('/unidades', registrationAuth, UnitsController);

//#endregion

// REGISTRATION HOME PAGE
router.get('/', userAuth, (req, res) => {
    res.send('Página inicial de registros...')
});

module.exports = router;