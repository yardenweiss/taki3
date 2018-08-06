const express = require('express');
const auth = require('./authUsers');
const authBoard = require('./authBoard');

const userManagement = express.Router();
userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({name:userName});
});

userManagement.get('/userStatus',[
    auth.checkIfPresent,
    authBoard.checkIfPresent,
    (req, res) => {
        res.json({showLogin: false});
    }
]);

userManagement.get('/allUsers', auth.userAuthentication, (req, res) => {	
	res.json(userList);
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {
    res.json({errMessage: ""});
});

userManagement.get('/logout', [
	auth.removeUserFromAuthList,
	(req, res) => {
		res.sendStatus(200);		
	}]
);


module.exports = userManagement;