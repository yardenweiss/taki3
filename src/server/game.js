const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authUsers');
const authBoard = require('./authBoard');
const game = require('../Logic/game');
const stateManagement = require('../Logic/stateManagement');
const enumCard = require('../Logic/enumCard');
const gameManagement = express.Router();

gameManagement.use(bodyParser.text());


gameManagement.post('/',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.active = true ;
        if (boardDetail.game === undefined) {
            boardDetail.game = new game(boardDetail.users, boardDetail.computer);
            boardDetail.stateManagement = new stateManagement();
            boardDetail.stateManagement.setStartGame(boardDetail.game, boardDetail.numOfPlayers);
            boardDetail.chatContent = [];
        }

        const userName = auth.getUserInfo(req.session.id).name;
        let uniqueId;
        uniqueId = getUniqueID(boardDetail, userName);
        if(uniqueId >= 4)
            boardDetail.stateManagement.addViewer(userName);


        let enumC;
        if(uniqueId === 0  || uniqueId >= 4)
            enumC = enumCard.enumCard.enumReactPosition_0;
        else if(uniqueId === 1 )
            enumC = enumCard.enumCard.enumReactPosition_1;
        else if(uniqueId === 2 )
            enumC = enumCard.enumCard.enumReactPosition_2;
        else
            enumC = enumCard.enumCard.enumReactPosition_3;

        res.json({uniqueId: uniqueId, enumCard: enumC, enumColor: enumCard.enumCard.enumColor});
    }
]);

function getUniqueID(boardDetail, userName){
    for (let i = 0; i < boardDetail.users.length; ++i) {
        if (userName === boardDetail.users[i]) {
            return i;
        }
    }

    for (let i = 0; i < boardDetail.viewers.length; ++i) {
        if (userName === boardDetail.viewers[i]) {
            return i + 4;
        }
    }
}

gameManagement.post('/pull',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const manger = boardDetail.stateManagement;
        const uniqueId = body.uniqueID;
        const userName = auth.getUserInfo(req.session.id).name;
        const answer = {playersCards: manger.playersCards,
            stackImage: manger.stackImage,
            gameState: manger.gameState,
            players: boardDetail.users,
            viewers: boardDetail.viewers,
            player: manger.getUserDetails(uniqueId, userName)};
        res.json({manager: answer});
    }
]);

gameManagement.post('/cardError',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.game.renderError(enumCard.enumCard.enumErrors.DRAG_CARD_WITH_CHANGE_COLOR_PICK,
            body.uniqueID);
        res.sendStatus(200);
    }
]);

gameManagement.post('/animationCardEnd',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        if(body.uniqueID < 4)
            boardDetail.game.animationCardEnd(body.uniqueID);
        else{
            const userName = auth.getUserInfo(req.session.id).name;
            const viewerManagements = boardDetail.stateManagement.viewerManagement;
            for(let i = 0; i < viewerManagements.length; ++i){
                if(userName === viewerManagements[i].name){
                    viewerManagements[i].stackCards.length = 0;
                    break;
                }
            }
        }
        res.sendStatus(200);
    }
]);

gameManagement.post('/setDrop',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.game.setDrop(body.id, body.uniqueID);
        res.sendStatus(200);
    }
]);

gameManagement.post('/colorPicked',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.game.colorPicked(body.color, body.uniqueID);
        res.sendStatus(200);
    }
]);

gameManagement.post('/pullCard',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        boardDetail.game.pullCard(body.uniqueID);
        res.sendStatus(200);
    }
]);

gameManagement.post('/finishAnimation',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        let card = boardDetail.game.gameCards[boardDetail.game.gameCards.length - 1];
        if(body.uniqueID < 4) {
            const playerManagements = boardDetail.stateManagement.playerManagement;
            playerManagements[body.uniqueID].openCard = {image: card.uniqueCardImage, id: card.id};
            playerManagements[body.uniqueID].dropCard = undefined;
            if (boardDetail.computer) {
                playerManagements[playerManagements.length - 1].openCard = {image: card.uniqueCardImage, id: card.id};
                playerManagements[playerManagements.length - 1].dropCard = undefined;
            }
        }else{
            const userName = auth.getUserInfo(req.session.id).name;
            const viewerManagements = boardDetail.stateManagement.viewerManagement;
            for(let i = 0; i < viewerManagements.length; ++i){
                if(userName === viewerManagements[i].name){
                    viewerManagements[i].openCard = {image: card.uniqueCardImage, id: card.id};
                    viewerManagements[i].dropCard = undefined;
                    break;
                }
            }
        }
        res.sendStatus(200);
    }
]);

gameManagement.post('/prev',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const uniqueId = body.uniqueID;
        boardDetail.game.prev(uniqueId);
        const turnIndex = boardDetail.stateManagement.playerManagement[uniqueId].turnIndex;
        const manger = boardDetail.stateManagement.playerManagement[uniqueId].savesStates[turnIndex];
        const answer = {playersCards: manger.playersCards,
            stackImage: manger.stackImage,
            gameState: manger.gameState,
            player: manger.playerManagement[uniqueId]};
        res.json({manager: answer});
    }
]);

gameManagement.post('/next',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const uniqueId = body.uniqueID;
        boardDetail.game.next(uniqueId);
        const turnIndex = boardDetail.stateManagement.playerManagement[uniqueId].turnIndex;
        const manger = boardDetail.stateManagement.playerManagement[uniqueId].savesStates[turnIndex];
        const answer = {playersCards: manger.playersCards,
            stackImage: manger.stackImage,
            gameState: manger.gameState,
            player: manger.playerManagement[uniqueId]};
        res.json({manager: answer});
    }
]);

gameManagement.post('/replay',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        const manger = boardDetail.stateManagement;
        const uniqueId = body.uniqueID;
        const userName = auth.getUserInfo(req.session.id).name;
        manger.playerManagement[uniqueId].showResults = undefined;
        const answer = {playersCards: manger.playersCards,
            stackImage: manger.stackImage,
            gameState: manger.gameState,
            player: manger.getUserDetails(uniqueId, userName)};
        res.json({manager: answer});
    }
]);

gameManagement.post('/finishGame',[
    auth.userAuthentication,
    (req, res) => {
        const body = JSON.parse(req.body);
        const boardDetail = authBoard.getBoardDetail(body.gameName);
        let uniqueId;
        if(body.uniqueID !== undefined)
            uniqueId = body.uniqueID;
        else{
            const userName = auth.getUserInfo(req.session.id).name;
            uniqueId = getUniqueID(boardDetail, userName);
        }
        const userName = auth.getUserInfo(req.session.id).name;
        if(uniqueId < 4) {
            for(let i = 0; i < boardDetail.users.length; ++i){
                if(boardDetail.users[i] === userName){
                    boardDetail.users.splice(i, 1);
                    break;
                }
            }
            boardDetail.registerPlayers--;
            if (boardDetail.users.length === 0) {
                boardDetail.active = false;
                boardDetail.game = undefined;
                boardDetail.stateManagement = undefined;
                boardDetail.color = "#2ec728";
                boardDetail.chatContent = undefined;
            }
        }else{
            if(boardDetail.stateManagement !== undefined) {
                boardDetail.stateManagement.removeViewer(userName);
            }
            for (let i = 0; i < boardDetail.viewers.length; ++i) {
                if (userName === boardDetail.viewers[i]) {
                    boardDetail.viewers.splice(i, 1);
                    break;
                }
            }

        }
        res.sendStatus(200);
    }
]);

module.exports = gameManagement;