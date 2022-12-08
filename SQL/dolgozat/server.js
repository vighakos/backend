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

// GET ALL RECORDS
server.get('/', (req, res) => {
    pool.query('SELECT * FROM foglalasok', (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

// INSERT RECORD
server.get('/insert', (req, res) => {
    let data = {
        'nev': req.body.nev,
        'telefonszam': req.body.telefonszam,
        'datum': req.body.datum,
        'idopont': req.body.idopont,
        'szolgaltatastipus': req.body.szolgaltatastipus
    }
    
    pool.query(`
        INSERT INTO foglalasok VALUES (null, '${data.nev}', '${data.telefonszam}', '${data.datum}', '${data.idopont}', '${data.szolgaltatastipus}')`, 
        (err, data) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(data)
        })
})

// UPDATE RECORD
server.get('/update/:id', (req, res) => {
    const ID = req.params.id
    let data = {
        'nev': req.body.nev,
        'telefonszam': req.body.telefonszam,
        'datum': req.body.datum,
        'idopont': req.body.idopont,
        'szolgaltatastipus': req.body.szolgaltatastipus
    }

    pool.query(
        `UPDATE foglalasok SET nev='${data.nev}', telefonszam='${data.telefonszam}', datum='${data.datum}', idopont='${data.idopont}', szolgaltatastipus='${data.szolgaltatastipus}' where id='${ID}'`, 
        (err, data) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(data)
        })
})

// DELETE RECORD
server.get('/delete/:id', (req, res) => {
    const ID = req.params.id

    pool.query(`DELETE FROM foglalasok where id='${ID}'`, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

// DELETE ALL RECORDS
server.get('/deleteall', (req, res) => {
    pool.query(`DELETE FROM foglalasok`, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

// SAVE ALL
server.get('/saveall', (req, res) => {
    pool.query(`SELECT * FROM foglalasok`, (err, data) => {
        if (err) res.status(500).send(err)
        else {
            fs.writeFile('adatok.txt', JSON.stringify(data), (err) => {
                if (err) res.status(500).send(err)
                else res.status(200).sendFile(path.join(__dirname + '/adatok.txt'))
            })
        } 
    })
    
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})