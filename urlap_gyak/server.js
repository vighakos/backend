const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/index.html'))
})

app.get('/listazas', (req, res) => {
    fs.readFile('adatok.csv', (err, data) => {
        if (err) {
            res.status(500).send('Hiba a fájl megnyitása közben')
        } else {
            var content = data.toString().trim()
            var records = content.split('\n')

            var db = 1
            var str = '<table border="1"><thead><tr><th>#</th><th>Név</th><th>Osztály</th><th>Lakcím</th><th>Kor</th></tr></thead><tbody>'
            records.forEach(item => {
                str += `<tr><td>${db}</td>`
                var data = item.split(';')
                data.forEach(adat => {
                    str += '<td>' + adat + '</td>'
                })
                str += '</tr>'
                db++
            })

            str += '</tbody></table>'

            res.status(200).send(str)
        }
    })
})

app.post('/adatfelvetel', (req, res) => {
    var nev = req.body.nev
    var oszt = req.body.oszt
    var lak = req.body.lak
    var kor = req.body.kor

    fs.appendFile('adatok.csv', `${nev};${oszt};${lak};${kor}\n`, (err) => {
        if (err) 
            res.status(500).send('Hiba a fájl írása közben')
        else 
            res.status(200).send('Sikeres')
    })
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}...`)
})