const express = require('express');
const router = express.Router();

// EXEMPLO: MODELO DE E-MAIL COM EDITOR INTEGRADO

//#region 
router.get('/', (req, res) => {
    res.send('Rota funcionando!');
    //res.render('modules/registration');
});
//#endregion

module.exports = router;