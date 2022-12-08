const express = require('express');
const config = require('../config.js');
const ejs = require('ejs');
var mysql = require('mysql');
const moment = require('moment');
const router = express.Router();

var pool = mysql.createPool(config.dbconfig);

router.post('/newdata', (req, res) => {
    let data = {
        date: req.body.date,
        stepcount: req.body.stepcount
    }

    req.app.locals.isMessage = true;
    pool.query(`SELECT ID FROM stepdatas WHERE date=? AND userID=?`, [data.date, req.session.loggedUserID], (err, results) => {
        if (results.length == 0) {
            pool.query(`INSERT INTO stepdatas VALUES(null, ?, ?, ?)`, [req.session.loggedUserID, data.date, data.stepcount], (err) => {
                req.app.locals.message = 'Successfully added stepdatas!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        } else {
            pool.query(`UPDATE stepdatas SET stepcount = stepcount + ? WHERE date=? AND userID=?`, [data.stepcount, data.date, req.session.loggedUserID], (err) => {
                req.app.locals.message = 'Successfully modified stepdatas!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        }
    });




});

module.exports = router;