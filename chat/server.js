const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const session = require('express-session');
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require('./utils/users.js');
const formatMessage = require('./utils/messages.js');
const { get } = require('https');

app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', (err, data) => {
        res.send(data);
    })
})

app.post('/chat', (req, res) => {

    let user = {
        nickname: req.body.nickname,
        roomname: req.body.roomname
    }

    if (user.nickname == '' || user.roomname == '') {
        res.redirect('/');
    } else {
        session.userName = user.nickname;
        session.roomName = user.roomname;
        ejs.renderFile('views/chat.ejs', { user }, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
})

io.on('connection', (socket) => {

    socket.on('joinRoom', () => {
        const user = userJoin(socket.id, session.userName, session.roomName);

        socket.join(user.room);

        // az új user üdvözlése
        socket.emit('message', formatMessage('Rendszerüzenet', `Üdvözlünk a ${user.room} szobában!`));

        // a room többi userének elküldeni, hogy valaki csatlakozott
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('Rendszerüzenet', `${user.username} csatlakozott a csevegéshez!`));

        // frissítjük a szobában lévő felhasználók listáját
        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room)
        });

    });


    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        // a room-nak elküldeni h a user elhagyta a chatet
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('Rendszerüzenet', `${user.username} elhagyta a csevegést!`));

        // frissítjük a szobában lévő felhasználók listáját
        io.to(session.roomName).emit('roomUsers', {
            users: getRoomUsers(session.roomName)
        });
    });

    socket.on('message', msg => {

        const user = getCurrentUser(socket.id);

        // kiküldjük a beérkezett üzenetet mindenkinek a szobában
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('typing', id => {

        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('typing', user.id);
    });
});

server.listen(3000);