const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const config = require('../config.js');
const moment = require('moment');
const mysql = require('mysql');

var pool = mysql.createPool(config.dbconfig);

router.get('/', (req, res) => {
    if (!req.app.locals.isMessage) {
        req.app.locals.message = '';
    }
    ejs.renderFile('views/index.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        req.app.locals.isMessage = false;
        res.send(data);
    });
});

router.get('/reg', (req, res) => {
    if (!req.app.locals.isMessage) {
        req.app.locals.message = '';
    }
    ejs.renderFile('views/registration.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        req.app.locals.isMessage = false;
        res.send(data)
    });
});

router.get('/main', (req, res) => {
    if (req.session.loggedIn) {
        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        ejs.renderFile('views/main.ejs', { app: config.appconfig, err: req.app.locals, user: req.session }, (err, data) => {
            req.app.locals.isMessage = false;
            res.send(data)
        });
    } else {
        res.redirect('/');
    }
});

router.get('/passmod', (req, res) => {
    if (req.session.loggedIn) {
        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        ejs.renderFile('views/passmod.ejs', { app: config.appconfig, err: req.app.locals, user: req.session }, (err, data) => {
            req.app.locals.isMessage = false;
            res.send(data)
        });
    } else {
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.app.locals.message = 'You are logged out!';
    req.app.locals.messagetype = 'success';
    req.session.loggedIn = false;
    req.session.loggedUserID = null;
    req.session.loggedUser = null;
    req.session.loggedUserMail = null;
    ejs.renderFile('views/index.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        res.send(data)
    });
});

router.get('/newdata', (req, res) => {
    if (req.session.loggedIn) {
        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        ejs.renderFile('views/newdata.ejs', { app: config.appconfig, err: req.app.locals, user: req.session, toDay: moment(new Date()).format('YYYY-MM-DD') }, (err, data) => {
            req.app.locals.isMessage = false;
            res.send(data)
        });
    } else {
        res.redirect('/');
    }
});

router.get('/tableview', (req, res) => {
    if (req.session.loggedIn) {

        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        pool.query(`SELECT * FROM stepdatas WHERE userID=? ORDER BY date DESC`, [req.session.loggedUserID], (err, results) => {

            ejs.renderFile('views/tableview.ejs', { app: config.appconfig, err: req.app.locals, user: req.session, toDay: moment(new Date()).format('YYYY-MM-DD'), records: results, moment }, (err, data) => {
                req.app.locals.isMessage = false;
                res.send(data)
            });
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;