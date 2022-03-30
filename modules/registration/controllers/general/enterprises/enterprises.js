const express = require('express');
const router = express.Router();

// Database Enterprises
const Enterprise = require('./Enterprise.js');

// Database Users
const User = require('../../admin/users/User.js');

//#region 
router.get('/', (req, res) => {
    res.render('modules/registration/enterprises/index.ejs');
});
//#endregion

//#region 
router.get('/novo', (req, res) => {
    res.render('modules/registration/enterprises/new.ejs');
});
//#endregion

//#region 
router.post('/novo', (req, res) => {

});
//#endregion

module.exports = router;