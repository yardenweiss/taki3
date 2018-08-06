const HumanPlayer = require('./HumanPlayer');
const SmartComputer = require('./smartComputer');
const statistics = require('./statistics');
const Stack = require('./stack');
const {enumCard} = require('./enumCard');
const {setCards, takiPermission, getUniqueCss} = require('./operations');

 class Game{

    constructor(users, computer){
        this.gameCards = [];
        this.turn = 0;
        this.setPlayers(users, computer);
        this.stack = new Stack();
        this.amountOfCardsToTakeFromStock = 1;
        this.endGame = false;
        this.computerEnd = false;
        this.colorPickLastCard = false;
        this.computerOperation = this.computerOperation.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    setPlayers(users, computer){
        this.players = [];
        for(let i = 0; i < users.length; ++i){
            this.players.push(new HumanPlayer(users[i], i));
        }
        if (computer)
            this.players.push(new SmartComputer(users.length));
        this.computer = computer;
    }
    
    changeTurn(promote, dropAnm) {
        this.players[this.turn].increasePlayerTurns();
        this.players[this.turn].calculateAVG();
        this.players[this.turn].resetPlayerClock();
        this.updateManagement(dropAnm);
        this.turn = (this.turn + promote) % this.players.length;
        let id = this.players[this.turn].id;
        this.stateManagement.playerManagement[id].error = [];
        this.gameStatistics.updateStatistics(this.turn,this.stack.getAllCards().length);
    }

     changeTurnForPlayerOutOfHand(promote, dropAnm, deleteIndex) {
         this.players[this.turn].increasePlayerTurns();
         this.players[this.turn].calculateAVG();
         this.players[this.turn].resetPlayerClock();
         this.gameStatistics.legacyPlayers.push(
             {
                 name: this.players[this.turn].name,
                 turnsPlayed: this.players[this.turn].getTurnsPlayed(),
                 singleCardCounter: this.players[this.turn].getSingleCardCounter(),
                 averageTimePlayed: this.players[this.turn].getAverageTimePlayed(),
             }
         );
         this.updateManagement(dropAnm);
         this.turn = (this.turn) % (this.players.length-1);
         this.players.splice(deleteIndex, 1);
         if(promote !== 1 && promote !== enumCard.enumResult.CONTINUE_TURN) {
             promote--;
             this.turn = (this.turn + this.players.length + promote) % this.players.length;
         }


         let playerManagement = this.stateManagement.playerManagement;
         for(let i = 0; i < this.players.length; ++i){
             playerManagement[this.players[i].id].turn = i;
         }
         let id = this.players[this.turn].id;
         this.stateManagement.playerManagement[id].error = [];
         this.gameStatistics.updateStatistics(this.turn,this.stack.getAllCards().length);
     }

    calcAmountCardsToTake(card) {
        if (card.getSign() === enumCard.enumTypes.TWO_PLUS) {
            if (this.amountOfCardsToTakeFromStock % 2 === 0)
                this.amountOfCardsToTakeFromStock += 2;
            else
                this.amountOfCardsToTakeFromStock = 2;
        } else
            this.amountOfCardsToTakeFromStock = 1;
    }

    partition() {
        let gameStartCard = this.stack.getValidOpenCard();
        setCards(this.gameCards, gameStartCard);
        this.stateManagement.playerManagement.forEach(p =>
            p.openCard = {image: gameStartCard[0].uniqueCardImage, id: gameStartCard[0].id});
        this.players.forEach(p => p.setCards(this.stack.getCards(8), this.players.length));
    }

    colorPicked(pickedColor, uniqueId) {
        this.stateManagement.playerManagement.forEach(p=> p.direction = []);
        this.stateManagement.playerManagement[uniqueId].pickColorVidibility = "hidden";
        this.gameCards[this.gameCards.length - 1].setColor(pickedColor);
        this.gameCards[this.gameCards.length - 1].setImage(getUniqueCss(Object.keys(enumCard.enumColor)[pickedColor],
            Object.keys(enumCard.enumTypes)[enumCard.enumTypes.CHANGE_COLOR], '_'));
        this.stateManagement.playerManagement.forEach(p =>
            p.openCard = {image: this.gameCards[this.gameCards.length - 1].uniqueCardImage, id: this.gameCards[this.gameCards.length - 1].id});
        let promote = enumCard.enumResult.NEXT_TURN;
        if(this.colorPickLastCard){
            this.colorPickLastCard = false;
            return this.runOutOfCards(promote);
        }
        this.changeTurn(promote, false);
        if(!this.computerEnd)
            setTimeout(this.computerOperation, 2200);
    }

    setDrop(id, uniqueID){
        let card = this.players[this.turn].getCard(id);
        if (card !== undefined) {
            this.dropValidation(card);
        }else
            this.renderError(enumCard.enumErrors.PULL_CARD_NOT_IN_TURN, uniqueID);
    }

    dropValidation(card) {
        if (takiPermission(this.players[this.turn], card) && card.doValidation(this.gameCards[this.gameCards.length - 1])) {
            let promote = this.players[this.turn].doOperation(card, this.gameCards[this.gameCards.length - 1]);
            this.gameCards[this.gameCards.length - 1].setActive(false);
            this.gameCards.push(card);
            this.stateManagement.playerManagement[this.players[this.turn].id].openCard =
                {image: card.uniqueCardImage, id: card.id};
            this.calcAmountCardsToTake(card);
            if(promote !== enumCard.enumResult.CONTINUE_TURN &&
                 card.sign === enumCard.enumTypes.CHANGE_DIR) {
                this.changeDir();
                promote = enumCard.enumResult.NEXT_TURN;
            }
            if (this.players[this.turn].getAmountOfCards() === 0 && card.getSign() !== enumCard.enumTypes.PLUS) {
                if (card.sign === enumCard.enumTypes.CHANGE_COLOR &&
                    this.players.length > 2)
                    this.colorPickLastCard = true;
                else
                    return this.runOutOfCards(promote);
            }
            if (!this.endGame){
                if (promote !== enumCard.enumResult.CONTINUE_TURN) {
                    this.changeTurn(promote, true);
                }else{
                    this.updateManagement(true);
                }
            }
            if(!this.computerEnd)
                setTimeout(this.computerOperation, 2200);
        }else{
            if(!takiPermission(this.players[this.turn], card))
                this.renderError(enumCard.enumErrors.CARD_NOT_IN_TAKI, this.turn);
            else
                this.renderError(enumCard.enumErrors.CARD_NOT_AUTHORIZED, this.turn);
        }
    }

     changeDir(){
        let newPlayers = [];
        for(let i = 0; i < this.players.length; ++i){
            let ind = (this.turn + this.players.length - i) % this.players.length;
            newPlayers.push(this.players[ind]);
        }
        this.turn = 0;
        this.players = newPlayers;
        this.gameStatistics.playersGame = newPlayers;
        let playerManagement = this.stateManagement.playerManagement;
        for(let i = 0; i < this.players.length; ++i){
             playerManagement[this.players[i].id].turn = i;
        }
     }

    refreshStockAndOpenCards() {
        let lastCard = this.gameCards.pop();
        this.stack.initializeStock(this.gameCards);
        this.gameCards = undefined;
        this.gameCards = [];
        this.gameCards.push(lastCard);
        this.stateManagement.playerManagement.forEach(p =>
            p.openCard = {image: lastCard.uniqueCardImage, id: lastCard.id});
        this.stateManagement.stackImage = this.stack.getStackImage();
    }

    pullCard(uniqueID){
        if (this.players[this.turn].id === uniqueID)
            this.pullCardValidation(this.players[this.turn]);
        else
            this.renderError(enumCard.enumErrors.PULL_CARD_NOT_IN_TURN, uniqueID);
    }

    pullCardValidation(player) {
        this.stateManagement.playerManagement.forEach(p=> p.direction = []);
        if (player === this.players[this.turn] && player.pullApproval(this.gameCards[this.gameCards.length - 1])) {
            this.stateManagement.stackImage = this.stack.getStackImage();
            this.stateManagement.playerManagement.forEach(p => p.pullCardAnimation = true);
            this.gameCards[this.gameCards.length - 1].setActive(false);
            player.setTakiMode(undefined);
            let cardsFromStock = this.stack.getCards(this.amountOfCardsToTakeFromStock);
            if (this.stack.getLength() <= this.amountOfCardsToTakeFromStock) {
                this.refreshStockAndOpenCards();
            }
            this.amountOfCardsToTakeFromStock = 1;
            player.pullCardFromStock(cardsFromStock);
            if(this.computer && !this.computerEnd) {
                let playerManagement = this.stateManagement.playerManagement;
                playerManagement[playerManagement.length - 1].stackCards.splice(0, 1);
            }
            let promote = enumCard.enumResult.NEXT_TURN;
            this.changeTurn(promote, false);
            if(!this.computerEnd)
                setTimeout(this.computerOperation, 2200);
        }
        else{
            this.renderError(enumCard.enumErrors.PULL_CARD_WITH_AVAILABLE_CARD, this.turn);
        }
    }

    computerOperation() {
        if (!this.endGame && this.players[this.turn].isComputer()) {
            this.stateManagement.playerManagement.forEach(p => p.pullCardAnimation = true);
            if (this.players[this.turn].colorToPick()) {
                let color = this.players[this.turn].getColor();
                this.colorPicked(color,this.turn);
            } else {
                let card = this.players[this.turn].pickCard(this.gameCards[this.gameCards.length - 1]);
                if (card === undefined)
                    this.pullCardValidation(this.players[this.turn]);
                else {
                    this.dropValidation(card);
                }
            }
        }
    }

    initialGameAndStatistics() {
        this.turn = 0;
        this.partition();
        this.gameStatistics = new statistics(this.players);
        this.gameStatistics.setManager(this.stateManagement);
        this.gameStatistics.updateStatistics(this.turn,this.stack.getAllCards().length);
        this.stateManagement.stackImage = this.stack.getStackImage();
        this.stateManagement.playerManagement.forEach(p => p.pickColorVidibility = "hidden");
    }

    startGame() {
        this.stack.setGame();
        this.initialGameAndStatistics();
        setTimeout(this.computerOperation, 2200);
    }

    prev(uniqueId){
        let playerManagement = this.stateManagement.playerManagement[uniqueId];
        playerManagement.showResults = undefined;
        if(playerManagement.turnIndex -1 >= 0) {
            playerManagement.savesStates[playerManagement.turnIndex].playerManagement[uniqueId].error = [];
            playerManagement.turnIndex--;
        }else{
            playerManagement.message = [];
            playerManagement.savesStates[playerManagement.turnIndex].playerManagement[uniqueId].error = "start game window";
        }
    }

    next(uniqueId){
        let playerManagement = this.stateManagement.playerManagement[uniqueId];
        if(playerManagement.turnIndex + 1 <
            playerManagement.savesStates.length) {
            playerManagement.savesStates[playerManagement.turnIndex].playerManagement[uniqueId].error = [];
            playerManagement.turnIndex++;
        }else {
            playerManagement.message = [];
            playerManagement.savesStates[playerManagement.turnIndex].playerManagement[uniqueId].error = "end game window";
        }
    }

    runOutOfCards(promote){
        let id = this.players[this.turn].id;
        this.stateManagement.playerManagement[id].gameState = "stopGaming";
        if(this.players[this.turn].isComputer())
            this.computerEnd = true;
        if(this.players.length === 2)
            this.makeEndGameMessage();
        else{
            if (this.winMessage === undefined)
                this.winMessage = this.players[this.turn].name;
            else if (this.secondPlaceMessage === undefined)
                this.secondPlaceMessage = this.players[this.turn].name;
        }
        let deleteIndex = this.turn;
        this.changeTurnForPlayerOutOfHand(promote, true, deleteIndex);
        if(!this.computerEnd)
            setTimeout(this.computerOperation, 2200);
        if(this.endGame)
            this.stateManagement.endGame(this.endMessage);
    }

    makeEndGameMessage() {
        let newMsg = [];
        let currentMes;
        if(this.winMessage){
            newMsg[0] = this.winMessage + " win!";
            if(this.secondPlaceMessage) {
                currentMes = "Second Place: " + this.secondPlaceMessage;
                newMsg.push(currentMes);
                currentMes = "Third Place: " + this.players[this.turn].name;
                newMsg.push(currentMes);
                currentMes = "Last Place: " + this.players[(this.turn + 1) % this.players.length].name;
                newMsg.push(currentMes);
            }else{
                currentMes = "Second Place: " + this.players[this.turn].name;
                newMsg.push(currentMes);
                currentMes = "Last Place: " + this.players[(this.turn + 1) % this.players.length].name;
                newMsg.push(currentMes);
            }
        }
        else{
            newMsg[0] = this.players[this.turn].name + " win!";
            currentMes = "Last Place: " + this.players[(this.turn + 1) % this.players.length].name;
            newMsg.push(currentMes);
        }
        this.endGame = true;
        this.endMessage = newMsg;
    }

    setManager(stateManagement) {
        this.stateManagement = stateManagement;
        this.players.forEach(p => p.setManager(stateManagement));
    }

    updateManagement(dropAnm) {
        if(dropAnm) {
            let card = this.gameCards[this.gameCards.length -1];
            this.stateManagement.playerManagement.forEach(
                p => p.dropCard = {playerID: this.players[this.turn].id, id: card.id});
            this.stateManagement.playerManagement[this.players[this.turn].id].dropCard = undefined;
            this.stateManagement.viewerManagement.forEach(
                v => v.dropCard = {playerID: this.players[this.turn].id, id: card.id});
        }
        let id = this.players[this.turn].id;
        this.stateManagement.playerManagement[id].error = [];
        if (this.stateManagement.playerManagement[id].stackCards.length === 0) {
            let cloneState = this.stateManagement.clone();
            this.stateManagement.playerManagement.forEach(p => p.savesStates.push(cloneState));
        }
    }

    animationCardEnd(uniqueID){
      this.stateManagement.playerManagement[uniqueID].stackCards.length = 0;
      this.renderEndAnimation(uniqueID);
    }

    renderEndAnimation(uniqueID){
        let playerManagement = this.stateManagement.playerManagement;
        playerManagement[uniqueID].message = [];
        this.players[playerManagement[uniqueID].turn].updateCardsToAdd();
        if(this.computer && uniqueID === 0) {
            playerManagement[playerManagement.length - 1].stackCards = [];
            if(!this.computerEnd)
                this.players[playerManagement[playerManagement.length - 1].turn].updateCardsToAdd();
        }
        if(this.gameStatistics.turnsCounter ===0)
            playerManagement[uniqueID].savesStates.push(this.stateManagement.clone());
        else {
            let cloneState = this.stateManagement.clone();
            playerManagement.forEach(p => p.savesStates.push(cloneState));
        }
    }

    renderError(error, playerID){
        this.stateManagement.playerManagement[playerID].error = error;
        this.stateManagement.playerManagement.forEach(p=> p.direction = []);
    }
}

module.exports = Game;