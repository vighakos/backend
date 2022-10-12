const express = require('express'),
    config = require('../config.js'),
    ejs = require('ejs'),
    router = express.Router()

router.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', {app: config.appconfig}, (err, data) => {
        res.send(data)
    })
})

module.exports = router;