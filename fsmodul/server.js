const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 3000

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/urlap.html'))
})

app.get('/adatok', (req, res) => {
    fs.readFile('adatok.txt', (err, data) => {
        if (err) {
            res.status(500).send('Hiba a aoskgálf mnyitás')
        } else {
            var content = data.toString().trim()
            var records = content.split('\n')

            var db = 1
            var str = '<table border="1"><thead><tr><th>Sorsz</th><th>Becenév</th><th>Kor</th><th>Fajta</th><th>Leírás</th></tr></thead><tbody>'
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

app.post('/senddata', (req, res) => {
    fs.readFile('adatok.json', (err, data) => {
        if (err) res.status(500).send('Hiba a fájl megnyitásakor')
        else 
        {
            adatok = JSON.parse(data)
            
            var adat = {
                "becenev": req.body.becenev,
                "kor": req.body.kor,
                "fajta": req.body.fajta,
                "leiras": req.body.leiras
            }

            adatok.push(adat)
            
            fs.writeFile('adatok.json', JSON.stringify(adatok), (err) => {
                if (err) res.status(500).send('Hiba')
                else res.status(200).send('Jó')
            }) 
        }
    })
})

app.listen(port,  () => {
    console.log(`Server listening on port ${port}...`)
})