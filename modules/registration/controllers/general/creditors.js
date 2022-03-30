const express = require('express');
const router = express.Router();

//#region 
router.get('/', (req, res) => {
    res.send('Rota funcionando!');
    //res.render('modules/registration');
});
//#endregion

module.exports = router;