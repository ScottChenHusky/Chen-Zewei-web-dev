var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');


var mongoose = require('mongoose');
var connectionString = 'mongodb://127.0.0.1:27017/webdev/assignment';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

//mongoose.connect('mongodb://localhost/cs4550summer1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 app.use(cookieParser());
 app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: true,
     saveUninitialized: true
 }));

//app.use(session({ secret: "thesecret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//require('./assignment/app.js')(app);
require('./project/app.js')(app);


app.listen(port, ipaddress);