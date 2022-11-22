const users = [];

// user joined to room
function userJoin(id, username, room) {
    const user = {
        id,
        username,
        room
    }
    users.push(user);
    return user;
}

// user leaves the room
function userLeave(id) {
    const idx = users.findIndex(user => user.id === id);
    if (idx != -1) {
        return users.splice(idx, 1)[0];
    }
}

// get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    userLeave,
    getCurrentUser,
    getRoomUsers
}