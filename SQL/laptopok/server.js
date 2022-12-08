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
    res.status(200).send('xd')
})

// GET ALL RECORDS
server.get('/laptopok', (req, res) => {
    pool.query(`SELECT * FROM laptopok`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        else {
            fs.writeFile('laptopok.csv', JSON.stringify(data), (err) => {
                if (err) res.status(500).send(err)
            })
            res.status(200).send(data)
        }
    })
})

// GET ONE RECORD
server.get('/laptopok/:id', (req, res) => {
    const laptopID = req.params.id
    pool.query(`SELECT * FROM laptopok WHERE id=${laptopID}`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        res.status(200).send(data)
    })
})

// DELETE ALL RECORDS
server.get('/deleteall', (req, res) => {
    pool.query(`DELETE * FROM laptopok`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        res.status(200).send(data)
    })
})

// INSERT NEW RECORD
server.post('/newlaptop', (req, res) => {
    let adatok = {
        'brand': req.body.brand,
        'type': req.body.type,
        'description': req.body.desc,
        'price': req.body.price
    }

    pool.query(`INSERT INTO laptopok VALUES(null, '${adatok.brand}', '${adatok.type}', '${adatok.description}', '${adatok.price}')`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        res.status(200).send(data)
    })
})

// DELETE ONE RECORD
server.post('/dellaptop/:id', (req, res) => {
    const laptopID = req.params.id
    pool.query(`DELETE FROM laptopok WHERE id=${laptopID}`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        res.status(200).send(data)
    })
})

// MODIFY RECORD
server.post('/modlaptop/:id', (req, res) => {
    const laptopID = req.params.id
    let adatok = {
        'brand': req.body.brand,
        'type': req.body.type,
        'description': req.body.desc,
        'price': req.body.price
    }

    pool.query(`UPDATE laptopok SET brand='${adatok.brand}', type='${adatok.type}', description='${adatok.description}', price='${adatok.price}' WHERE id=${laptopID}`, (err, data) => {
        if (err) res.status(500).send(err.sqlMessage)
        res.status(200).send(data)
    })
})



server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})