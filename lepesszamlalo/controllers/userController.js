const express = require('express'),
    config = require('../config.js'),
    router = express.Router()

var mysql = require('mysql'),
    pool = mysql.createPool(config.dbconf)

router.get('/', (req, res) => {
    
})

module.exports = router;