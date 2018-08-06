const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userManagement = require('./server/userManagement');
const auth = require('./server/authUsers');
const chatManagement = require('./server/chat');
const lobbyManagement = require('./server/lobby');
const gameManagement = require('./server/game');
const app = express();

app.use(session({ secret: 'keyboard cat', cookie: {maxAge:269999999999}}));
app.use(bodyParser.text());

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use('/users', userManagement);
app.use('/chat', chatManagement);
app.use('/lobby', lobbyManagement);
app.use('/game', gameManagement);

app.listen(3000, console.log('web taki'));