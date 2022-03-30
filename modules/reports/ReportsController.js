const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./modules/reports/index.ejs');
});

router.get('/balanco', (req, res) => {
    res.render('./modules/reports/balance.ejs');
});

router.get('/contas-bancarias', (req, res) => {
    res.render('./modules/reports/bankAccounts.ejs');
});

router.get('/indicadores-financeiros', (req, res) => {
    res.render('./modules/reports/financialIndicators.ejs');
});

router.get('/contas-a-pagar', (req, res) => {
    res.render('./modules/reports/accountsToPay.ejs');
});

router.get('/contas-pagas', (req, res) => {
    res.render('./modules/reports/accountsPayable.ejs');
});

router.get('/contas-a-receber', (req, res) => {
    res.render('./modules/reports/accountsToReceive.ejs');
});

router.get('/contas-recebidas', (req, res) => {
    res.render('./modules/reports/accountsReceivable.ejs');
});

router.get('/obra', (req, res) => {
    res.render('./modules/reports/constructions.ejs');
})



module.exports = router;