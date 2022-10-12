require('dotenv').config()

const express = require('express'),
    server = express(),
    config = require('./config.js'),
    path = require('path'),
    fs = require('fs'),
    sha1 = require('sha1'),
    moment = require('moment'),
    ejs = require('ejs'),
    port = config.appconfig.port

var mysql = require('mysql'),
    pool = mysql.createPool(config.dbconf),
    session = require('express-session')

server.use(express.urlencoded({extended: true}))
server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))



server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})