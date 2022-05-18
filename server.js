var mysql = require("mysql");
var express = require('express');
var bodyParser = require("body-parser");
var helmet = require('helmet');
var validator = require('validator');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var minify = require('express-minify');
var compression = require('compression');
var request = require('request');
var fs = require('fs');
var querystring = require('querystring');
var childProcess = require('child_process');
var path = require("path");
var randomString = require('random-string');
var TelegramBot = require('node-telegram-bot-api');

const DB_HOST = 'localhost';
const DB_USER = 'sttpln';
const DB_PASS = 'OYf0BFUMoGwMzsFu';
const DB_NAME = 'sttpln_bemkbmweb';

const port = 5555;
// create connection to database
const MainDB = mysql.createConnection ({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

// connect to database
MainDB.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('[MySQL] Connected to database : ' + DB_NAME);
});
global.MainDB = MainDB;


process.env["NTBA_FIX_350"] = 1;
const token = '692773354:AAHe4E_QxDWrw2Ag4-j0UYd0qwCk-RZ3Sxk';
//const bot = new TelegramBot(token, {polling: true});


var app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'f36f4271e21c7e539eba5fbfc504329a',
    resave: false,
    saveUninitialized: false,
}));
app.use(fileUpload());

app.use(compression());
app.use(minify());

// Static WebPages
app.use('/Web/', express.static('public/Web'));
app.use('/Web/News/', express.static('public/Web'));
app.use('/Web/Events/', express.static('public/Web'));

// set the view engine to ejs
app.set('view engine', 'ejs');

const Routing = require('./routes/index.js');

// Auto redirect to Main Page
app.all('/', function(req, res){
	return res.redirect('/Web/');
});
app.use('/Web', Routing.Web);

app.listen(port);
console.log('[ExpressJS] Listening to port : ' + port.toString());
