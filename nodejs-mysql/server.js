const express = require('express')
const path = require('path')
var mysql = require('mysql')
const app = express()
const port = 8080

var pool  = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  user : 'root',
  password : '',
  database : '214szft_elso'
})

app.use(express.urlencoded({extended: true}))

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.get('/newuser', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/newuser.html'))
})

app.get('/moduser', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/moduser.html'))
})

app.post('/newuser', (req, res) => {
    var data = {
        "name": req.body.name,
        "email": req.body.email,
        "pass1": req.body.passw1,
        "pass2": req.body.passw2
    }
    if (data.pass1 != data.pass2) {
        res.status(200).send('A megadott jelszavak nem egyeznek')
    } else {
        pool.query(`insert into users values(null, '${data.name}', '${data.email}', SHA1('${data.pass1}'))`, (err, results) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(results)
        })
    }       
})

app.get('/deleteuser/:ID', (req, res) => {
    var userID = req.params.ID

    pool.query(`DELETE FROM users WHERE ID=${userID}`, (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.post('/moduser', (req, res) => {
    var data = {
        "id": req.body.id,
        "name": req.body.name,
        "email": req.body.email,
        "pass1": req.body.passw1,
        "pass2": req.body.passw2
    }
    if (data.pass1 != data.pass2) {
        res.status(200).send('A megadott jelszavak nem egyeznek')
    } else {
        pool.query(`update users set name='${data.name}', email='${data.email}', password=SHA1('${data.pass1}')) where id='${data.id}')`, (err, results) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(results)
        })
    }       
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})
