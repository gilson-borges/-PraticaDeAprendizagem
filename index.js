const express = require('express');
const app = express();

// CORS
const cors = require('cors');
app.use(cors());

// COOKIE PARSER
const cookieParser = require('cookie-parser');
app.use(cookieParser('asgsDPÇçafdsofçELÇedlawfdDçdeafposkPKSADÇÇdlSDAÇKEOFpoisaçdkaeçokaefoPASKposÇ'));

// SESSION
const session = require("express-session");

// USE SESSION
app.use(session({
    secret: "çerwrWEAWREafe342IJfe7FIsada7scsrEfm6EejsadC4mrrbLcGvvpFertrenRGWGasdD.czxctret;y24,VC3gX42Vd6XÇzÇç14p6cx7it8rLX+=etembcbserwttrjh6326d5f487",
    cookie: { 
        resave: false,
        maxAge: 43200000
    }
}))

// EXPRESS-FLASH
const flash = require('express-flash');
app.use(flash());

// MIDDLEWARE USER
const userAuth = require('./middlewares/userAuth');

// View Engine
app.set('view engine', 'ejs');

// HTML Body
app.use(express.urlencoded({extended: true}));

//JSON
app.use(express.json());

// Static
app.use(express.static('public'));

// Import Controllers
const LoginController = require('./modules/login/LoginController.js');
const ReportsController = require('./modules/reports/ReportsController.js');
const RegistrationController = require('./modules/registration/RegistrationController.js');

// Use Controllers
app.use('/login', LoginController);
app.use('/relatorios', ReportsController);
app.use('/cadastros', RegistrationController);

// Database Connection
const connection = require('./database/database');

// Database Connection Authenticate
connection.authenticate().then(() => {
    console.log('Conexão realizada com o banco de dados!');
}).catch(() => {
    console.log('ERRO! A conexão não pôde ser realizada com o banco de dados...');
});

app.get('/', userAuth, (req, res) => {
    res.render('index.ejs')
});

app.get('/ajuda', userAuth, (req, res) => {
    res.render('help.ejs')
});

const cep = require('cep-promise');

app.post('/zipCode', (req, res) => {

    const zipCodeValue = !isNaN(req.body.zipCode) ? req.body.zipCode : "";

    if(zipCodeValue.length === 8){

        cep(zipCodeValue).then(zipCode => {

            res.json(zipCode);

        }).catch(() => {

            res.json(null);

        })

    } else {

        res.json(null);

    }
});

app.listen(8080, (err) => console.log(err ? "Inicialização do servidor falhou!" : "Servidor Iniciador!"));