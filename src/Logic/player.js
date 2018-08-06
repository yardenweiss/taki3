const {enumCard} = require('./enumCard');
const {takiModeChecker} = require('./operations');



class Player{
    constructor(theName,theTurn){
        this.allCards = [];
        this.singleCardCounter = 0;
        this.averageTimePlayed = 0;
        this.turnsPlayedForStatistics = 0;
        this.takiMode = undefined;
        this.name = theName;
        this.id = theTurn;
    }

    setManager(stateManagement){
        this.stateManagement = stateManagement;
    }

    increasePlayerTurns(){
        this.turnsPlayedForStatistics += 1;
    }

    pullApproval(lastCard){
        let answer = true;
        this.allCards.some(card =>{
           if(card.doValidation(lastCard)) {
               answer = false;
               return true;
           }
        });
        return answer;
    }

    getCard(id) {
        let cardToReturn = undefined;
        this.allCards.some(card => {
            if (card.getId().toString() === id) {
                cardToReturn = card;
                return true;
            }
        });

        return cardToReturn;
    }

    clear(){
        this.allCards = [];
        this.singleCardCounter = 0;
        this.averageTimePlayed = 0;
        this.turnsPlayedForStatistics = 0;
        this.takiMode = undefined;
    }

    getTurnsPlayed(){
        return this.turnsPlayedForStatistics;
    }

    getAmountOfCards(){
        return this.allCards.length;
    }

    setTakiMode(card) {
        this.takiMode = card;
    }

    getAllCards(){
        return this.allCards;
    }

    getTakiMode() {
        return this.takiMode;
    }

    getAverageTimePlayed(){
        return this.averageTimePlayed;
    }

    setCardsPlace(){
        this.stateManagement.playersCards[this.id] = [];
        this.addCards(this.allCards);
    }

    addCards(cardsToAdd) {
        this.stateManagement.playerManagement.forEach(p => p.stackCards.push({playerID: this.id, id: cardsToAdd[0].id}));
        this.stateManagement.viewerManagement.forEach(v => v.stackCards.push({playerID: this.id, id: cardsToAdd[0].id}));
        this.saveCardsToAdd = cardsToAdd;
    }

    updateCardsToAdd() {
        if(this.saveCardsToAdd !== undefined){
            this.saveCardsToAdd.forEach(card => {
                this.stateManagement.playersCards[this.id].push({image: card.uniqueCardImage, id: card.id});
            });
            this.saveCardsToAdd = undefined;
        }
    }

    getSingleCardCounter(){
        return this.singleCardCounter;
    }


    doOperation(card, lastCard) {
        this.stateManagement.updateDirection(card, this.id);
        this.stateManagement.deletePlayerCard(card,this.id);

        let promote = card.doOperation(this, lastCard);
        if (this.takiMode !== undefined) {
            if(takiModeChecker(this.allCards, this.takiMode)) {
                promote = enumCard.enumResult.CONTINUE_TURN;
                card.setActive(false);
            }
            else{
                this.takiMode = undefined;
                if(promote === enumCard.enumResult.CONTINUE_TURN)
                    promote = enumCard.enumResult.NEXT_TURN;
            }
        }
        if (this.allCards.length === 1)
            this.singleCardCounter++;
        return promote;
    }
}

module.exports = Player;