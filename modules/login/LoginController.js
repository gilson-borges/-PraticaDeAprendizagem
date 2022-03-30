const express = require('express');
const router = express.Router();

// Database Users
const User = require('../registration/controllers/admin/users/User.js');

// Password Hash
const bcrypt = require('bcryptjs');

// JWT (Token Recover Password)
const jwt = require('jsonwebtoken');
const JWTSecret = "aewwqe12421qrfewfçewewfewçqw214wewrwkdew213q052çwemartcarptoesa";

//#region Login Page
router.get('/', (req, res) => {
    (req.session.user == undefined) ? res.render('./modules/login/index.ejs') : res.redirect('/');
});
//#endregion

//#region Login Authentication
router.post('/auth', (req, res) => {

    if(req.session.user == undefined){

        const user = req.body.user || "";
        const password = req.body.password || "";

        if(user.replace(/\s/g, '') !== "" && password.replace(/\s/g, '') !== ""){

            User.findOne({where: {user: user}}).then((user) => {

                if(user){

                    if(bcrypt.compareSync(password, user.password)){

                        req.session.user = {
                            id: user.id,
                            name: user.name,
                            permissions: user.permissions 
                        }

                        res.redirect('/');

                    } else {
                        res.redirect('/login');
                    }

                } else {
                    res.redirect('/login');
                }

            }).catch(() => {
                res.redirect('/login');
            })

        } else {
            res.redirect('/login');
        }

    } else {
        res.redirect('/');
    }
    
});
//#endregion

//#region Help
router.get('/ajuda', (req, res) => {
    (req.session.user == undefined) ? res.render('./modules/login/help.ejs') : res.redirect('/');
});
//#endregion

//#region Recover Password

//#region Recover Password Page
router.get('/recuperar-senha', (req, res) => {
    (req.session.user == undefined) ? res.render('./modules/login/recovery.ejs', { msg: '' }) : res.redirect('/');
});
//#endregion

//#region Verify Recover Password / Create Recover Token / E-mail Send With Recover Token
router.post('/recuperar-senha', (req, res) => {

    const email = (req.body.email).replace(/\s/g, '');

    if(email != ""){

        User.findOne({ where: { email: email }}).then((user) => {

            if(user){

                jwt.sign({
                    id: user.id,
                    email: user.email
                }, JWTSecret, { expiresIn: '1h' }, (err, token) => {
                    
                    if(err){

                        res.render('./modules/login/recovery.ejs', {
                            msg: "Ocorreu um erro interno ao enviar o e-mail! Tente novamente..."
                        });

                    } else {
                        
                        const transporter = require('../../config/email/transporter.js');

                        (async () => {
                            await transporter.sendMail({
                                subject: 'Verificando',
                                text: 'Recuperação de Senha',
                                from: 'Sistema Plena <sistema.plenaconstrutora@gmail.com>',
                                to: email,
                                html: `
                                <html>
                                <body>
                                <div align="center" style="font-family: Arial, sans-serif;">

                                    <img src="cid:logo" style="width: 8cm;" ondragstart="return false;">

                                    <br>

                                    <h2>Você requisitou uma recuperação de senha?</h2>

                                    <p>
                                    Recebemos um pedido para alteração de senha, caso tenha solicitado clique no botão abaixo
                                    </p>

                                    <h2><a href="http://localhost:8080/login/recuperar-senha/${token}" style="text-decoration: none; color: blue;">RECUPERAR SENHA</a></h2>

                                    <p>
                                    OBS: O link de recuperação tem prazo limite de 1 hora!
                                    </p>

                                    <p>
                                    Caso não tenha solicitado, desconsidere este email, sua senha não será alterada.
                                    </p>

                                    <p>Obrigado,</p>

                                </div>
                                </body>
                                </html>
                                `,
                                attachments: [{
                                    filename: 'logo.png',
                                    path: __dirname + '/logo.png',
                                    cid: 'logo' 
                                }]
                            });
                        })();

                        res.render('./modules/login/recovery.ejs', {
                            msg: `E-mail enviado para ${email}!`
                        });
                    }
                });            

            } else {
                res.render('./modules/login/recovery.ejs', {
                    msg: "E-mail não encontrado na base de dados!"
                });
            }

        }).catch(() => {
            res.render('./modules/login/recovery.ejs', {
                msg: "Ocorreu um erro interno ao enviar o e-mail! Tente novamente..."
            });
        });

    } else {
        res.render('./modules/login/recovery.ejs', {
            msg: "E-mail inválido!"
        });
    }
});
//#endregion

//#region Token Password Change Page
router.get('/recuperar-senha/:token', (req, res) => {

    const token = req.params.token;

    jwt.verify(token, JWTSecret, (err, data) => {

        if(err){
            res.redirect('/login/recuperar-senha');
        } else {
            res.render('./modules/login/changePassword.ejs', {
                token
            });
        }

    });
});
//#endregion

//#region Password Change
router.post('/recuperar-senha/:token', (req, res) => {

    const token = req.params.token;

    jwt.verify(token, JWTSecret, (err, data) => {

        if(err){
            res.redirect('/login/recuperar-senha');
        } else {

            const {password, confirmPassword} = req.body;

            if(password === confirmPassword){
                
                if(password.replace(/\s/g, '') !== ""){

                    // HASH
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);

                    User.update({ password: hash}, { where: {id: data.id}}).then(() => {
                        res.redirect('/login');
                    }).catch(() => {
                        res.redirect(`/login/recuperar-senha/${token}`)
                    })

                } else {
                    res.redirect(`/login/recuperar-senha/${token}`);
                }
            }
        }
    });
});
//#endregion

//#endregion

//#region Logout 
router.get('/logout', (req, res) => {

    req.session.user = null;

    res.redirect('/login');
})
//#endregion

module.exports = router;