require('dotenv').config()
const express = require('express')
    server = express()
    port = process.env.PORT

var mysql = require('mysql')
    pool  = mysql.createPool({
        connectionLimit : 10,
        host : process.env.DBHOST,
        user : process.env.DBUSER,
        password : process.env.DBPASS,
        database : process.env.DBNAME
    })

server.use(express.urlencoded({extended: true}))

// GET ALL RECORDS
server.get('/:table', (req, res) => {
    var table = req.params.table
    pool.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        } 
        else {
            res.status(200).send(results)
        }
    })
})

// GET ONE RECORD
server.get('/:table/:id', (req, res) => {
    var table = req.params.table
    var id = req.params.id
    pool.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        } 
        else {
            res.status(200).send(results)
        }
    })
})

// INSERT RECORD
server.post('/:table', (req, res) => {
    var table = req.params.table
    var records = req.body
    var strValues = 'null'
    var strKeys = 'id'

    var fields = Object.keys(records)
    fields.forEach(field => {
        strKeys += `, ${field}`
    })

    var values = Object.values(records)
    values.forEach(value => {
        strValues += `, '${value}'`
    })

    pool.query(`INSERT INTO ${table} (${strKeys}) VALUES(${strValues})`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(results)
        }
    })
})

// UPDATE RECORD
server.patch('/:table/:id', (req, res) => {
    var table = req.params.table,
        id = req.params.id,
        records = req.body,
        str = '',
        fields = Object.keys(records),
        values = Object.values(records)

    for (let i = 0; i < fields.length; i++) {
        str += `${fields[i]}='${values[i]}'`
        if (i != fields.length - 1) str += ","
    }

    pool.query(`UPDATE ${table} SET ${str} WHERE id=${id}`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(results)
        }
    })
})

// DELETE ALL RECORDS
server.delete('/:table', (req, res) => {
    var table = req.params.table
    var id = req.params.id
    pool.query(`DELETE FROM ${table}`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        } 
        else {
            res.status(200).send(results)
        }
    })
})

// DELETE ONE RECORD
server.delete('/:table/:id', (req, res) => {
    var table = req.params.table
    var id = req.params.id
    pool.query(`DELETE FROM ${table} where id=${id}`, (err, results) => {
        if (err) {
            res.status(500).send(err)
        } 
        else {
            res.status(200).send(results)
        }
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})