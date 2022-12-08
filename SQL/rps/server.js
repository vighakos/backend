const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const ejs = require('ejs')
const session = require('express-session')

const { get } = require('https')

app.use(express.static('assets'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', (err, data) => {
        res.send(data);
    })
})

app.post('/newGame', (req, res) => {
    let nickname = req.body.nickname
    if (nickname == '') {
        res.redirect('/')
    } else {
        ejs.renderFile('views/game.ejs', { nickname }, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
})

app.listen(3000, () => {
    console.log("Server listening................................................");
})