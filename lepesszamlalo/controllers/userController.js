const express = require('express'),
    config = require('../config.js'),
    ejs = require('ejs'),
    sha1 = require('sha1'),
    router = express.Router()

var mysql = require('mysql'),
    pool = mysql.createPool(config.dbconf)

router.post('/login', (req, res) => {
    ejs.renderFile('views/main.ejs', {app: config.appconfig}, (err, data) => {
        res.send(data)
    })
})

router.post('/reg', (req, res) => {
    let userdata = {
        name: req.body.username,
        email: req.body.usermail,
        pass1: req.body.userpass1,
        pass2: req.body.userpass2
    }

    if (userdata.email == '' || userdata.name == '' || userdata.pass1 == '' || userdata.pass2 == '') {
        req.locals.message.text = 'Some fields are empty!'
        res.redirect('/reg')
    }
    if (userdata.pass1 != userdata.pass2) {
        req.locals.message.text = 'The passwords do not match!'
        res.redirect('/reg')
    }
    
    pool.query(`SELECT id FROM users WHERE email=?`, [userdata.email], (err, results) => {
        if (results.length > 0) {
            req.locals.message.text = 'This email address is taken!'
            res.redirect('/reg')
        }
        pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, null, 1)`, [userdata.name, userdata.email, sha1(userdata.pass1)], (err, data) => {
            res.redirect('/')
        })
    })
})

module.exports = router;