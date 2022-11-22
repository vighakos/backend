const moment = require('moment');

function formatMessage(username, msg) {
    return {
        username,
        msg,
        time: moment().format('HH:mm')
    }
}

module.exports = formatMessage;