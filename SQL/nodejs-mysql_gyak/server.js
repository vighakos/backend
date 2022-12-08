const express = require('express')
const path = require('path')
var mysql = require('mysql')
const app = express()
const port = 3000

var pool  = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : '214szft_mobilok'
})

app.use(express.urlencoded({extended: true}))

app.get('/keszulekek', (req, res) => {
    pool.query('SELECT * FROM keszulekek', (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.get('/ujkeszulek', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/ujkeszulek.html'))
})

app.post('/ujkeszulek', (req, res) => {
    var data = {
        "gyarto": req.body.gyarto,
        "tipus": req.body.tipus,
        "memoria": req.body.memoria,
        "tarhely": req.body.tarhely,
        "oprendszer": req.body.oprendszer,
        "processzor": req.body.proc,
        "garancia": req.body.garancia,
        "ar": req.body.ar,
        "szin": req.body.szin
    }

    pool.query(`insert into keszulekek values(null, '${data.gyarto}', '${data.tipus}', '${data.memoria}', '${data.tarhely}', '${data.oprendszer}', '${data.processzor}', '${data.garancia}', '${data.ar}', '${data.szin}')`, (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.get('/deleterow/:ID', (req, res) => {
    var rowID = req.params.ID

    pool.query(`DELETE FROM keszulekek WHERE ID=${rowID}`, (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.get('/change', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/change.html'))
})

app.post('/change', (req, res) => {
    var data = {
        "id": req.body.id,
        "gyarto": req.body.gyarto,
        "tipus": req.body.tipus,
        "memoria": req.body.memoria,
        "tarhely": req.body.tarhely,
        "oprendszer": req.body.oprendszer,
        "processzor": req.body.proc,
        "garancia": req.body.garancia,
        "ar": req.body.ar,
        "szin": req.body.szin
    }

    pool.query(`update keszulekek set gyarto='${data.gyarto}', tipus='${data.tipus}', memoria='${data.memoria}', tarhely='${data.tarhely}', oprendszer='${data.oprendszer}', processzor='${data.processzor}', garancia='${data.garancia}', ar='${data.ar}', szin='${data.szin}' where id=${data.id}`, (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })    
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})