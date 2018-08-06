const userList = {};
const users = [];

function userAuthentication(req, res, next) {
    if (userList[req.session.id] === undefined) {
        res.sendStatus(404);
    } else {
        next();
    }
}

function checkIfPresent(req, res, next) {
    if (userList[req.session.id] === undefined) {
        res.json({showLogin: true});
    } else {
        next();
    }
}

function addUserToAuthList(req, res, next) {	
	if (userList[req.session.id] !== undefined) {
		res.json({errMessage: "User name already exist, please try another one"});
	}else if(req.body.length === 0 || req.body.length > 20)
        res.json({errMessage: "User name have to be between 1 to 20 letters"});
	else {
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.body) {
                res.json({errMessage: "User name already exist, please try another one"});
				return;
			}
		}		
		userList[req.session.id] = req.body;
		users.push(req.body);
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {
		const name = userList[req.session.id];
		delete userList[req.session.id];
		users.splice(users.lastIndexOf(name,0), 1);
		next();
	}
}

function getUserInfo(id) {	
    return {name: userList[id]};
}

function getAllUsers() {
	return users;
}

module.exports = {checkIfPresent, userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, getAllUsers};
