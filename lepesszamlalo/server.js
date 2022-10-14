const express = require('express'),
    server = express(),
    config = require('./config.js'),
    path = require('path'),
    port = config.appconfig.port,
    session = require('express-session'),
    appController = require('./controllers/appController.js'),
    userController = require('./controllers/userController.js'),
    stepdataController = require('./controllers/stepdataController.js')

server.locals.message = {
    text: '',
    type: 'danger'
}

server.use('/assets', express.static(path.join(__dirname + '/assets')))
server.use('/views', express.static(path.join(__dirname + '/views')))
server.use(express.urlencoded({extended: true}))
server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

server.use('/', appController)
server.use('/users', userController)
server.use('/stepdata', stepdataController)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})