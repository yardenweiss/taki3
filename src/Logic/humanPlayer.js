const Player = require('./player');
const {enumCard} = require('./enumCard');
const {setCards} = require('./operations');


class HumanPlayer extends Player{
    constructor(username,playerTurn){
        super(username,playerTurn);
        this.turnsPlayed = 0;
        this.currentTurnTime = 0;
    }

    removeCard(card) {
        for (let i = 0; i < this.allCards.length; ++i) {
            if (this.allCards[i] === card) {
                this.allCards.splice(i, 1);
            }
        }
    }

    calcCurrentTurn() {
            this.currentTurnTime += 1;
     }

    calculateAVG() {
        this.averageTimePlayed *= (this.turnsPlayed - 1);
        this.averageTimePlayed += this.currentTurnTime;
        this.averageTimePlayed /= this.turnsPlayed;
    }

    resetPlayerClock() {
        this.currentTurnTime = 0;
    }

    setCards(theCards) {
        this.allCards = theCards;
        setInterval(this.calcCurrentTurn.bind(this),1000);
        super.setCardsPlace();
    }

    increasePlayerTurns() {
        this.turnsPlayed += 1;
        super.increasePlayerTurns();
    }

    doOperation(card, lastCard){
        this.removeCard(card);
        return super.doOperation(card, lastCard);
    }

    pullCardFromStock(cardsToSet) {
        setCards(this.allCards, cardsToSet);
        super.addCards(cardsToSet);
    }


    isDraggable(){
        return true;
    }

    isComputer() {
        return false;
    }

    clear(){
        super.clear();
        this.turnsPlayed = 0;
        this.currentTurnTime = 0;
    }

    pickColor() {
        this.stateManagement.playerManagement[this.id].pickColorVidibility = "visible";
        return enumCard.enumResult.CONTINUE_TURN;
    }
}

module.exports = HumanPlayer;