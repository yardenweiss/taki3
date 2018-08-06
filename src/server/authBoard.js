const auth = require('./authUsers');
const enumCard = require('../Logic/enumCard');
const boards = {};
const boardList = [];


function boardAuthentication(req, res, next) {
    const body = JSON.parse(req.body);
    if(boards[body.gameName] !== undefined) {
        return res.json({sendInProgress: false, errMessage: "game name already exist"});
    } else if(body.gameName.length > 20 || body.gameName.length === 0){
        return res.json({sendInProgress: false,
            errMessage: "game name have to be between 1 to 20 letters"});
    }else
        next();
}

function checkIfPresent(req, res, next) {
    const userName = auth.getUserInfo(req.session.id).name;
    for( let i = 0; i < boardList.length; ++i){
        let boardDetail = {registerPlayers: boardList[i].registerPlayers,
            numOfPlayers: boardList[i].numOfPlayers,  gameName: boardList[i].gameName,
            users: boardList[i].users, computer: boardList[i].computer, viewers: boardList[i].viewers};

        for(let j = 0; j < boardList[i].users.length; ++j){
            if(boardList[i].users[j] === userName){
                if(boardList[i].registerPlayers === boardList[i].numOfPlayers) {
                    res.json({
                        room4: true,
                        room3: false,
                        myIndex: j,
                        enumCard: getEnumCard(j),
                        enumColor: enumCard.enumCard.enumColor,
                        boardDetail: boardDetail
                    });
                    return;
                }else {
                    res.status(200).json({viewer: false, room3: true, boardDetail: boardDetail});
                    return;
                }
            }
        }

        for(let j = 0; j < boardList[i].viewers.length; ++j){
            if(boardList[i].viewers[j] === userName){
                if(boardList[i].registerPlayers === boardList[i].numOfPlayers) {
                    res.status(200).json({
                        room4: true,
                        room3: false,
                        myIndex: j + 4,
                        enumCard: getEnumCard(j + 4),
                        enumColor: enumCard.enumCard.enumColor,
                        viewer: true,
                        boardDetail: boardDetail
                    });
                    return;
                }else {
                    res.status(200).json({viewer: true, room3: true, boardDetail: boardDetail});
                    return;
                }
            }
        }

    }

    next();
}

function getEnumCard(uniqueId) {
    if(uniqueId === 0  || uniqueId >= 4)
        return enumCard.enumCard.enumReactPosition_0;
    else if(uniqueId === 1 )
        return enumCard.enumCard.enumReactPosition_1;
    else if(uniqueId === 2 )
        return enumCard.enumCard.enumReactPosition_2;
    return enumCard.enumCard.enumReactPosition_3;
}

function addBoardToBoardList(boardDetails) {
    boards[boardDetails.gameName] = boardDetails;
    boardList.push(boardDetails);
}

function DeleteBoardFromBoardList(boardDetails) {
    delete boards[boardDetails.gameName];
    for(let i = 0; i < boardList.length; ++i){
        if(boardDetails.gameName === boardList[i].gameName){
            boardList.splice(i, 1);
            break;
        }
    }
}


function getAllBoards() {
    return boardList;
}

function checkAvailability(req, res, next) {
    const body = JSON.parse(req.body);
    if(boards[body.gameName].registerPlayers < boards[body.gameName].numOfPlayers) {
        boards[body.gameName].registerPlayers++;
    }
    else if(boards[body.gameName].active === true) {
        return res.json({sendInProgress: false,
            errMessage: "The game is full"});
    }
    next();
}

function getBoardDetail(gameName) {
    return boards[gameName];
}


module.exports = {checkIfPresent, DeleteBoardFromBoardList, addBoardToBoardList, boardAuthentication, getAllBoards, checkAvailability, getBoardDetail};
