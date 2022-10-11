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

let message = ''

server.use('/assets', express.static(path.join(__dirname + '/assets')))
server.use(express.urlencoded({extended: true}))
server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

server.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', {app: config.appconfig}, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

server.get('/reg', (req, res) => {
    ejs.renderFile('views/register.ejs', {app: config.appconfig, hiba: ''}, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

server.post('/reg', (req, res) => {
    let userdata = {
        name: req.body.username,
        email: req.body.email,
        pass1: req.body.passwd1,
        pass2: req.body.passwd2
    }

    
    if (userdata.name == null ||
        userdata.email == null ||
        userdata.pass1 == null ||
        userdata.pass2 == null) 
    {
        message = 'Nem adtál meg minden adatot!!!!!!!!'
        res.status(206).send(message)
    } else {
        if (userdata.pass1 != userdata.pass2) {
            message = 'A megadatoto jelszavaka neme egyeznek !!!!!!!!!!!!!'
            res.status(206).send(message)
        } else {
            pool.query(`SELECT * FROM users WHERE email=?`, [userdata.email], (err, results) => {
                if (err) res.status(500).send(err)
                else {
                    if (results.length != 0) {
                        message = 'foglalt XD'
                        res.status(206).send(message)
                    } else {
                        pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)`, [userdata.name, userdata.email, sha1(userdata.pass1)], (err, results) => {
                            if (err) res.status(500).send(err)
                            else {
                                message = 'Sickers'
                                res.status(200).send(message)
                            }
                        })
                    }
                }
            })
        }
    }  
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})