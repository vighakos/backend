var socket = io();

const sendBtn = document.querySelector('#sendBtn');
const msgField = document.querySelector('#message');
const chatMessages = document.querySelector('.chat-messages');

sendBtn.addEventListener('click', () => {
    const msg = msgField.value;
    if (msg != '') {
        socket.emit('message', msg);
        msgField.value = '';
        msgField.focus();
    }
});

msgField.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        const msg = msgField.value;
        if (msg != '') {
            socket.emit('message', msg);
            msgField.value = '';
            msgField.focus();
        }
    } else {
        socket.emit('typing', socket.id);
    }
})

socket.emit('joinRoom');

socket.on('message', (data) => {
    outputMessage(data);

});

socket.on('roomUsers', data => {
    updateUsers(data.users);
})

socket.on('typing', user => {
    const feedback = document.querySelector('#fb_' + user);
    feedback.innerText = `Éppen üzenetet ír...`;
    setTimeout(() => {
        feedback.innerText = '';
    }, 1500);
})

function outputMessage(data) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');

    p.classList.add('uname');
    p.innerText = data.username;
    div.appendChild(p);

    p2 = document.createElement('span');
    p2.innerText = data.time;
    div.appendChild(p2);

    p3 = document.createElement('p');
    p3.innerText = data.msg;
    div.appendChild(p3);

    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateUsers(users) {
    userList = document.querySelector('.userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="bi bi-person-fill"></i> ${user.username} <em id="fb_${user.id}"></em>`;
        userList.appendChild(li);
    });
}