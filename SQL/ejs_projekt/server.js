const express= require('express'),
    server = express(),
    config = require('./config.js'),
    path = require('path'),
    ejs = require('ejs'),
    port = config.appconfig.port

var mysql = require('mysql'),
    pool = mysql.createPool(config.dbconf)

server.use(express.urlencoded({extended: true}))
server.use(express.static(path.join(__dirname + '/css')))

server.get('/', (req, res) => {
    pool.query(`select * from users`, (err, results) => {
        if (err) res.send(err)
        ejs.renderFile('public/index.ejs', {results}, (err, data) => {
            if (err) res.send(err)
            res.send(data)
        })
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})