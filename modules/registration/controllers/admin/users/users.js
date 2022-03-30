const express = require('express');
const router = express.Router();

// Database Users
const User = require('./User.js');

// Bcrypt
const bcrypt = require('bcryptjs');

// Sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//#region LISTAGEM DE USUÁRIOS
router.get('/', (req, res) => {
    res.render('modules/registration/users/index');
});
//#endregion

//#region PESQUISAR USUÁRIOS
router.get('/pesquisar', (req, res) => {
    
    //const {id, i}

    res.json({

    });
})
//#endregion

//#region CRIAR NOVO USUÁRIO
router.get('/novo', (req, res) => {
    res.render('modules/registration/users/new');
});
//#endregion

//#region SALVAR NOVO USUÁRIO
router.post('/novo', (req, res) => {

    const {user, password, confirmPassword, name, email, phone} = req.body;
    const {admin, management, financial, engineering, supply, commercial, sales, registration} = req.body;

    if(password === confirmPassword){

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const permissions = JSON.stringify({
            admin: Boolean(admin),
            management: Boolean(management),
            financial: Boolean(financial),
            engineering: Boolean(engineering),
            supply: Boolean(supply),
            commercial: Boolean(commercial),
            sales: Boolean(sales),
            registration: Boolean(registration)
        });

        if(user.replace(/\s/g, '') !== "" && password.replace(/\s/g, '') !== "" && name.replace(/\s/g, '') !== "" && email.replace(/\s/g, '') !== ""){

            // Verifica se algum usuário possuí o mesmo valor de "user" ou "email"
            User.findOne({ where: {[Op.or]: [{user: user}, {email: email}]}}).then((existUser) => {
    
                if(existUser){
                    res.redirect('/cadastros/usuarios/novo');
                } else {
                    User.create({
                        user,
                        password: hash,
                        name,
                        email,
                        phone,
                        permissions
                    }).then(() => {
                        res.redirect('/login');
                    }).catch(() => {
                        res.redirect('/cadastros/usuarios/novo');
                    })
                }
    
            }).catch(() => {
                res.redirect('/cadastros/usuarios/novo');
            })
    
        } else {
            res.redirect('/cadastros/usuarios/novo')
        }

    } else {
        res.redirect('/cadastros/usuarios/novo')
    }
});
//#endregion

//#region EDITAR USUÁRIOS
router.get('/editar/:id', (req, res) => {

    const userId = req.params.id;

    User.findByPk(userId).then(user => {

        if(user){
            res.render('modules/registration/users/edit', {
                user
            })
        } else {
            res.redirect('/cadastros/usuarios');
        }

    }).catch(() => {
        res.redirect('/cadastros/usuarios');
    })
});
//#endregion

module.exports = router;