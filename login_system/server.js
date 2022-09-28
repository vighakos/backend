const { resourceUsage } = require('process')

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
    pool = mysql.createPool(config.dbconf)

server.use(express.urlencoded({extended: true}))

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
                        pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, null, 1)`, [userdata.name, userdata.email, sha1(userdata.pass1)], (err, results) => {
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
    let userdata = {
        email: req.body.email,
        passwd: req.body.pass
    }

    let message = ''

    if (userdata.email == null || userdata.passwd == null) {
        message = 'Nem adtál meg minden adatot!!!!!!!!'
        res.status(206).send(message)
    } else {
        pool.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [userdata.email, sha1(userdata.passwd)], (err, results) => {
            if (err) res.status(500).send(err)
            else {
                if (results.length == 0) {
                    message = 'Hibás aadatok!!!!!!!!'
                    res.status(206).send(message)
                } else {
                    if (results[0].status == 0) {
                        message = 'ki vagyb bannolva LOL XDDDDDDDD'
                        res.status(206).send(message)
                    } else {
                        pool.query(`UPDATE users SET last=? WHERE id=?`, [moment(new Date()).format(), results[0].id], (err, results) => {
                            if (err) res.status(500).send(err)
                            else res.status(200).send(results)
                        })
                    }
                }
            }
        })
    }
})

// USER LOGOUT
server.post('/logout', (req, res) => {

})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})