const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./authUsers');
const authBoard = require('./authBoard');
const chatManagement = express.Router();

chatManagement.use(bodyParser.text());

chatManagement.post('/',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const userInfo =  auth.getUserInfo(req.session.id);
        if(boardDetail.users[body.uniqueID] === auth.getUserInfo(req.session.id).name) {
            boardDetail.chatContent.push({user: userInfo, text: body.text});
            res.sendStatus(200);
        }
    }
]);

chatManagement.post('/pull',[
	auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
		if(boardDetail.users[body.uniqueID] === auth.getUserInfo(req.session.id).name)
        	res.json(boardDetail.chatContent);
    }
]);

module.exports = chatManagement;