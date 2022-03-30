const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();

// SESSION
const session = require("express-session");

// USE SESSION
app.use(session({
    secret: "çerwrWEAWREafe342IJfe7FIsada7scsrEfm6EejsadC4mrrbLcGvvpFertrenRGWGasdD.czxctret;y24,VC3gX42Vd6XÇzÇç14p6cx7it8rLX+=etembcbserwttrjh6326d5f487",
    cookie: { 
        resave: false,
        maxAge: 86400000
    }
}))

// MIDDLEWARE USER
const userAuth = require('./middlewares/userAuth');

// View Engine
app.set('view engine', 'ejs');

// HTML Body
app.use(express.urlencoded({extended: true}));

// Static
app.use(express.static('public'));

//CORS
const cors = require('cors');
app.use(cors());

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
    res.render('index.ejs')
});

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

sslServer.listen(80, (err) => console.log(err ? "Inicialização do servidor falhou!" : "Servidor Iniciador!"));