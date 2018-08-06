const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authUsers');
const authBoard = require('./authBoard');

const lobbyManagement = express.Router();

lobbyManagement.use(bodyParser.text());

lobbyManagement.get('/',auth.userAuthentication, (req, res) => {
        const users = auth.getAllUsers();
        const boards = authBoard.getAllBoards();
        let boardMsg = [];
        const userName =  auth.getUserInfo(req.session.id).name;
        boards.forEach(b => boardMsg.push({numOfPlayers: b.numOfPlayers,
            registerPlayers: b.registerPlayers, viewers: b.viewers.length,
            gameName: b.gameName, color: b.color, userName: b.userName,
            deleteAccess: b.userName === userName && b.users.length === 0 &&
            b.viewers.length === 0}));
        res.json({boards: boardMsg, users: users});
    });

lobbyManagement.post('/',[
        auth.userAuthentication,
        authBoard.boardAuthentication,
        (req, res) => {
            const body = JSON.parse(req.body);
            const gameName = body.gameName;
            const numOfPlayers = body.numOfPlayers;
            const computer = body.computer;
            let registers = 0;
            if(computer) {
                registers = 1;
            }
            const userInfo =  auth.getUserInfo(req.session.id);
            const details = {gameName: gameName, numOfPlayers: numOfPlayers,
                userName:userInfo.name, computer: computer, viewers: [],
                users: [], active: false, registerPlayers: registers ,
                color: "#2ec728"};
            authBoard.addBoardToBoardList(details);
            return res.json({errMessage: "", sendInProgress: false});
        }
]);

lobbyManagement.post('/boardClicked',[
        auth.userAuthentication,
        authBoard.checkAvailability,
        (req, res) => {
            const body = JSON.parse(req.body);
            const boardDetail = authBoard.getBoardDetail(body.gameName);
            boardDetail.users.push(auth.getUserInfo(req.session.id).name);
            if(boardDetail.registerPlayers === boardDetail.numOfPlayers){
                boardDetail.color = "#c10000";
            }
            res.json({sendInProgress: false,
                boardDetail: {registerPlayers: boardDetail.registerPlayers,
                    numOfPlayers: boardDetail.numOfPlayers,
                    gameName: boardDetail.gameName}});
        }
    ]);

lobbyManagement.post('/viewGame',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.viewers.push(auth.getUserInfo(req.session.id).name);
        res.json({boardDetail: {registerPlayers: boardDetail.registerPlayers,
                numOfPlayers: boardDetail.numOfPlayers,  gameName: boardDetail.gameName}});
    }
]);

lobbyManagement.post('/deleteGame',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const userName =  auth.getUserInfo(req.session.id).name;
        if(boardDetail.userName === userName && boardDetail.users.length === 0 &&
            boardDetail.viewers.length === 0){
            authBoard.DeleteBoardFromBoardList(boardDetail);
            res.json({sendInProgress: false, errMessage: ""});
        }else if(boardDetail.userName !== userName){
            res.json({sendInProgress: false,
                errMessage: "only the user that created the game, can delete it"});
        }else if(boardDetail.users.length !== 0){
            res.json({sendInProgress: false,
                errMessage: "game need to be empty from players, inorder to delete it"});
        }else{
            res.json({sendInProgress: false,
                errMessage: "game need to be empty from viewers, inorder to delete it"});
        }
    }
]);

lobbyManagement.post('/getBoard',[
    auth.userAuthentication,
    (req, res) => {
        const body = req.body;
        const boardDetail = authBoard.getBoardDetail(body);
        res.json({boardDetail: {registerPlayers: boardDetail.registerPlayers,
                numOfPlayers: boardDetail.numOfPlayers,  gameName: boardDetail.gameName, users: boardDetail.users, computer: boardDetail.computer, viewers: boardDetail.viewers}});
    }
]);
module.exports = lobbyManagement;