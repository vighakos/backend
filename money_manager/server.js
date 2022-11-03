const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config.js');
const app = express();

const appController = require('./controllers/appController.js');
const userController = require('./controllers/userController.js');
const stepdataController = require('./controllers/stepdataController.js');

// Middlewares
app.use('/assets', express.static(path.join(__dirname + '/assets')));
app.use('/views', express.static(path.join(__dirname + '/views')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.locals.message = '';
app.locals.messagetype = 'danger';
app.locals.isMessage = false;

app.use('/', appController);
app.use('/users', userController);
app.use('/steps', stepdataController);

app.listen(config.appconfig.port, () => {
    console.log(`Server listening on port ${config.appconfig.port}...`);
});