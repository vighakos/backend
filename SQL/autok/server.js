require('dotenv').config()

const express = require('express'),
    path = require('path'),
    fs = require('fs'),
    dbconfig = require('./config.js'),
    server = express(),
    port = process.env.PORT

var mysql = require('mysql'),
    pool = mysql.createPool(dbconfig)

server.use(express.urlencoded({extended: true}))

server.get('/', (req, res) => {
    
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})