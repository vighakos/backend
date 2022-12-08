require('dotenv').config()

const express = require('express'),
    server = express(),
    config = require('./config.js'),
    path = require('path'),
    fs = require('fs'),
    sha1 = require('sha1'),
    moment = require('moment'),
    port = config.appconfig.port

var mysql = require('mysql'),
    pool = mysql.createPool(config.dbconf),
    session = require('express-session')

server.use(express.urlencoded({extended: true}))
server.use(session({
    secret: 'asd',
    resave: false,
    saveUninitialized: true
}))

// USER REGISTRATION
server.post('/reg', (req, res) => {
    let userdata = {
        name: req.body.name,
        email: req.body.email,
        pass1: req.body.pass1,
        pass2: req.body.pass2
    }

    let message = {}
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

// USER LOGIN
server.post('/login', (req, res) => {
    let message = ''
    if (!req.session.loggedin) {
        let userdata = {
            email: req.body.email,
            passwd: req.body.pass
        }
    
        if (userdata.email == null || userdata.passwd == null) {
            message = 'Nem adtál meg minden adatot!!!!!!!!'
            res.status(206).send(message)
        }

        pool.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [userdata.email, sha1(userdata.passwd)], (err, results) => {
            if (err) res.status(500).send(err)
            if (results.length == 0) {
                message = 'Hibás aadatok!!!!!!!!'
                res.status(206).send(message)
            }
            if (results[0].status == 0) {
                message = 'ki vagyb bannolva XDDDDDDDD'
                res.status(206).send(message)
            }

            let userdata = results
            pool.query(`UPDATE users SET last=? WHERE id=?`, [moment(new Date()).format(), userdata.id], (err, results) => {
                if (err) res.status(500).send(err)
                
                req.session.loggedin = true
                message = 'Siekres bejel'
                res.status(200).send(message)
            })
        })
    } else {
        message = 'mán be vagyol jelenzetve'
        res.status(203).send(message)
    }
})

// USER LOGOUT
server.post('/logout', (req, res) => {
    let message = ''

    if (req.session.loggedin) {
        req.session.loggedin = false
        message = 'Siekeres kkijel'
        res.status(200).send(message)
    } else {
        message = 'Nem vagy bejelentekeztve:!!!'
        res.status(200).send(message)
    }
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})