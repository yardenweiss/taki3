const {enumCard} = require('./enumCard');
const Player = require('./player');


class SmartComputer extends Player{

    constructor(playerTurn){
        super("ComputerPlayer",playerTurn);
        this.colorsCards = [[], [], [], []];
        this.typesCards = [[], [], [], [], [], [], [], []];
        this.numberOfPlayers = undefined;
        this.lastCardInTaki = undefined;
        this.pickedColor = false;
    }

    insertColor(playerCard) {
        this.colorsCards[playerCard.getColor()].push(playerCard);
    }

    insertType(playerCard) {
        this.typesCards[playerCard.getSign()].push(playerCard);
    }

    setAllCards(cards) {
        for(let i = 0; i < cards.length; ++i){
            if(cards[i].getColor() !== undefined)
                this.insertColor(cards[i]);
            this.insertType(cards[i]);
            this.allCards.push(cards[i]);
        }
    }

    colorsLeftAmount() {
        let colors = 0;
        for(let i = 0; i < this.colorsCards.length; ++i){
            if(this.colorsCards[i].length > 0)
                colors++;
        }
        return colors;
    }

    equal(parameterOne, parameterTwo) {
        return parameterOne === parameterTwo;
    }

    different(parameterOne, parameterTwo) {
        return parameterOne !== parameterTwo;
    }

    typeCardWithLeastSameColorInHand(type) {
        let pickedCard = undefined;
        for(let i = 0; i < this.typesCards[type].length; ++i) {
            let currentCard = this.typesCards[type][i];
            if(pickedCard === undefined)
                pickedCard = currentCard;
            else if(this.colorsCards[pickedCard.getColor()].length > this.colorsCards[currentCard.getColor()].length)
                pickedCard = currentCard;
        }
        return pickedCard;
    }

    typeAndColorMatch(type, color, matchFunc) {
        for(let i = 0; i < this.typesCards[type].length; ++i){
            if(matchFunc(this.typesCards[type][i].getColor(), color))
                return this.typesCards[type][i];
        }
        return undefined;
    }

    typeOrColorMatch(type, lastGameCard, matchFunc) {
        let pickedCard = this.typeAndColorMatch(type, lastGameCard.getColor(), matchFunc);
        if( pickedCard === undefined && type === lastGameCard.getSign()){
            return this.typeCardWithLeastSameColorInHand(type);
        }
        return pickedCard;
    }

    connectionNumber(color, matchFunc) {
        let pickedCard;
        for(let i = 0; i < this.colorsCards[color].length; ++i){
            if(this.colorsCards[color][i].getSign() === enumCard.enumTypes.NUMBER) {
                pickedCard = this.cardNumberInDifferentColor(this.colorsCards[color][i]);
                if (matchFunc(pickedCard, undefined)) {
                        return this.colorsCards[color][i];
                }
            }
        }
        return undefined;
    }

    cardNumberInDifferentColor(lastGameCard) {
        for(let i = 0; i < this.typesCards[enumCard.enumTypes.NUMBER].length; ++i){
            let numberCard = this.typesCards[enumCard.enumTypes.NUMBER][i];
            if(numberCard.getColor() !== lastGameCard.getColor() && numberCard.number === lastGameCard.number)
                return numberCard;
        }

        return undefined;
    }

    findColorCardNotInGivenType(color, type) {
        for(let i = 0; i < this.colorsCards[color].length; ++i){
            if(this.colorsCards[color][i].getSign() !== type)
                return this.colorsCards[color][i];
        }
        return undefined;
    }

    regularOperationWithTwoPlayers(lastGameCard) {
        let pickedCard;
        if(this.typeAndColorMatch(enumCard.enumTypes.STOP, lastGameCard.getColor(), this.different) === undefined){
            pickedCard = this.typeAndColorMatch(enumCard.enumTypes.STOP, lastGameCard.getColor(), this.equal);
            if(pickedCard !== undefined)
                return pickedCard;
        }

        pickedCard = this.connectionNumber(lastGameCard.getColor(), this.equal);
        if(pickedCard !== undefined)
            return pickedCard;
        pickedCard = this.connectionNumber(lastGameCard.getColor(), this.different);
        if(pickedCard !== undefined)
            return pickedCard;
        if (lastGameCard.getSign() === enumCard.enumTypes.NUMBER) {
            pickedCard = this.cardNumberInDifferentColor(lastGameCard);
            if (pickedCard !== undefined)
                return pickedCard;
        }
        pickedCard = this.typeOrColorMatch(enumCard.enumTypes.TWO_PLUS, lastGameCard, this.equal);
        if(pickedCard !== undefined)
            return pickedCard;
        pickedCard = this.typeOrColorMatch(enumCard.enumTypes.STOP, lastGameCard, this.equal);
        if(pickedCard !== undefined)
            return pickedCard;
        return this.typeOrColorMatch(enumCard.enumTypes.PLUS, lastGameCard, this.equal);
    }

    regularOperationWithMorePlayers(lastGameCard) {
        let pickedCard;
        pickedCard = this.connectionNumber(lastGameCard.getColor(), this.equal);
        if (pickedCard !== undefined)
            return pickedCard;
        pickedCard = this.connectionNumber(lastGameCard.getColor(), this.different());
        if (pickedCard !== undefined)
            return pickedCard;
        if (lastGameCard.getSign() === enumCard.enumTypes.NUMBER) {
        pickedCard = this.cardNumberInDifferentColor(lastGameCard);
        if (pickedCard !== undefined)
            return pickedCard;
        }
        pickedCard = this.typeOrColorMatch(enumCard.enumTypes.PLUS, lastGameCard, this.equal);
        if(pickedCard !== undefined)
            return pickedCard;
        pickedCard = this.typeOrColorMatch(enumCard.enumTypes.STOP, lastGameCard, this.equal);
        if(pickedCard !== undefined)
            return pickedCard;
        return this.typeOrColorMatch(enumCard.enumTypes.TWO_PLUS, lastGameCard, this.equal);
    }

    colorCardInTaki(lastGameCard) {
        let currentCard;
        for(let i = 0; i < this.colorsCards[lastGameCard.getColor()].length; ++i){
            currentCard = this.colorsCards[lastGameCard.getColor()][i];
            if(currentCard.getId() !== this.lastCardInTaki.getId() && currentCard.doValidation(lastGameCard)) {
                return currentCard;
            }
        }

        if(this.lastCardInTaki.doValidation(lastGameCard)){
            currentCard = this.lastCardInTaki;
            this.lastCardInTaki = undefined;
            return currentCard;
        }

        return undefined;
    }

    takiOperationWithTwoPlayers(lastGameCard) {
        if(this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.different) !== undefined){
            this.lastCardInTaki = this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.equal);
            if(this.lastCardInTaki !== undefined)
                return;
        }
        if(this.typeAndColorMatch(enumCard.enumTypes.STOP, lastGameCard.getColor(), this.different) !== undefined){
            this.lastCardInTaki = this.typeAndColorMatch(enumCard.enumTypes.STOP, lastGameCard.getColor(), this.equal);
            if(this.lastCardInTaki !== undefined)
                return;
        }
        this.lastCardInTaki = this.connectionNumber(lastGameCard.getColor(), this.different);
        if(this.lastCardInTaki !== undefined)
            return;
        this.lastCardInTaki = this.typeAndColorMatch(enumCard.enumTypes.TWO_PLUS, lastGameCard.getColor(), this.equal);
        if(this.lastCardInTaki !== undefined)
            return;
        this.lastCardInTaki = this.findColorCardNotInGivenType(lastGameCard.getColor(), enumCard.enumTypes.PLUS);
        if(this.lastCardInTaki !== undefined)
            return;
        if(this.colorsCards[lastGameCard.getColor()].length > 0)
            this.lastCardInTaki = this.colorsCards[lastGameCard.getColor()][0];
        else
            this.lastCardInTaki = undefined;
    }

    takiOperationWithMorePlayers(lastGameCard) {
        if(this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.different) !== undefined){
            this.lastCardInTaki = this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.equal);
            if(this.lastCardInTaki !== undefined)
                return;
        }
        this.lastCardInTaki = this.typeAndColorMatch(enumCard.enumTypes.STOP, lastGameCard.getColor(), this.equal);
        if(this.lastCardInTaki !== undefined)
            return;
        this.lastCardInTaki = this.connectionNumber(lastGameCard.getColor(), this.different);
        if(this.lastCardInTaki !== undefined)
            return;
        this.lastCardInTaki = this.findColorCardNotInGivenType(lastGameCard.getColor(), enumCard.enumTypes.PLUS);
        if(this.lastCardInTaki !== undefined)
            return;
        if(this.colorsCards[lastGameCard.getColor()].length > 0)
            this.lastCardInTaki = this.colorsCards[lastGameCard.getColor()][0];
        else
            this.lastCardInTaki = undefined;
    }


    removeCard(stock, card) {
        for (let i = 0; i < stock.length; ++i) {
            if (stock[i] === card) {
                stock.splice(i, 1);
            }
        }
    }

    removeAllCardAppearances(card) {
        if(card.getColor() !== undefined)
            this.removeCard(this.colorsCards[card.getColor()], card);
        this.removeCard(this.typesCards[card.getSign()], card);
        this.removeCard(this.allCards, card);
    }

    firstAvailableCard(lastGameCard) {
        for(let i = 0; i < this.allCards.length; ++i){
            if(this.allCards[i].doValidation(lastGameCard))
                return this.allCards[i];
        }
        return undefined;
    }

    regularOperation(lastGameCard) {
        let pickedCard = undefined;
        if(this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.different) === undefined){
            pickedCard = this.typeAndColorMatch(enumCard.enumTypes.PLUS, lastGameCard.getColor(), this.equal);
            if(pickedCard !== undefined)
                return pickedCard;
        }
        if (this.numberOfPlayers === 2)
            pickedCard = this.regularOperationWithTwoPlayers(lastGameCard);
        else if (this.numberOfPlayers > 2)
            pickedCard = this.regularOperationWithMorePlayers(lastGameCard);
        return pickedCard;
    }

    signOperation(lastGameCard) {
        let differentColorType;
        if (lastGameCard.getSign() !== enumCard.enumTypes.PLUS && lastGameCard.getSign() !== enumCard.enumTypes.STOP)
            return undefined;
        differentColorType = this.typeCardWithLeastSameColorInHand(lastGameCard.getSign());
        if (this.colorsCards[lastGameCard.getColor()].length > 0) {
            if (differentColorType === undefined ||
                this.colorsCards[lastGameCard.getColor()].length <= this.colorsCards[differentColorType.getColor()].length)
                return this.regularOperation(lastGameCard);
        }
        return differentColorType;
    }

    superTakiExecute(lastGameCard) {
        let pickedCard = undefined;
        if(this.colorsLeftAmount() === 1 && this.colorsCards[lastGameCard.getColor()].length > 0 &&
            this.typesCards[enumCard.enumTypes.SUPER_TAKI].length > 0){
            pickedCard = this.typesCards[enumCard.enumTypes.SUPER_TAKI][0];
        }
        return pickedCard;
    }

    takiOperation(lastGameCard) {
        let pickedCard;
        if(this.takiMode !== undefined){
            if(this.lastCardInTaki === undefined) {
                if (this.numberOfPlayers === 2)
                    this.takiOperationWithTwoPlayers(lastGameCard);
                else if (this.numberOfPlayers > 2)
                    this.takiOperationWithMorePlayers(lastGameCard);
            }
            pickedCard = this.colorCardInTaki(lastGameCard);
        }else{
            pickedCard = this.typeAndColorMatch(enumCard.enumTypes.TAKI, lastGameCard.getColor(), this.equal);
        }
        return pickedCard;
    }

    plusTwoOperation(lastGameCard) {
        if(lastGameCard.getSign() === enumCard.enumTypes.TWO_PLUS && lastGameCard.isActive())
            return this.typeCardWithLeastSameColorInHand(enumCard.enumTypes.TWO_PLUS);
        else
            return undefined;
    }

    operation(lastGameCard){
        let pickedCard;
        pickedCard = this.plusTwoOperation(lastGameCard);
        if(pickedCard === undefined && lastGameCard.isActive())
            return undefined;
        else if(pickedCard === undefined)
            pickedCard = this.takiOperation(lastGameCard);
        if(pickedCard === undefined)
            pickedCard = this.superTakiExecute(lastGameCard);
        if(pickedCard === undefined)
            pickedCard = this.signOperation(lastGameCard);
        if(pickedCard === undefined)
            pickedCard = this.regularOperation(lastGameCard);
        if(pickedCard === undefined){
            if (this.typesCards[enumCard.enumTypes.CHANGE_COLOR].length > 0)
                pickedCard = this.typesCards[enumCard.enumTypes.CHANGE_COLOR][0];
        }
        if(pickedCard === undefined)
            pickedCard = this.firstAvailableCard(lastGameCard);
        return pickedCard;
    }


    addCard(cardsToAdd) {
        for(let i = 0; i < cardsToAdd.length; ++i){
            if(cardsToAdd[i].getColor() !== undefined)
                this.insertColor(cardsToAdd[i]);
            this.insertType(cardsToAdd[i]);
            this.allCards.push(cardsToAdd[i]);
        }
        super.addCards(cardsToAdd);
    }

    takiWithConnection() {
        let color, tempCard;
        for (let i = 0; i < this.typesCards[enumCard.enumTypes.TAKI].length; ++i) {
            color = this.typesCards[enumCard.enumTypes.TAKI][i].getColor();
            if (this.typeAndColorMatch(enumCard.enumTypes.PLUS, color, this.different) !== undefined) {
                tempCard = this.typeAndColorMatch(enumCard.enumTypes.PLUS, color, this.equal);
                if (tempCard !== undefined)
                    return color;
            } else if (this.numberOfPlayers === 2) {
                if (this.typeAndColorMatch(enumCard.enumTypes.STOP, color, this.different) !== undefined) {
                    tempCard = this.typeAndColorMatch(enumCard.enumTypes.STOP, color, this.equal);
                    if (tempCard !== undefined)
                        return color;
                }
            }
        }
    }

    takiWithNumberConnection() {
        let color, tempCard;
        for (let i = 0; i < this.typesCards[enumCard.enumTypes.TAKI].length; ++i) {
            color = this.typesCards[enumCard.enumTypes.TAKI][i].getColor();
            tempCard = this.connectionNumber(color, this.different);
            if (tempCard !== undefined)
                return color;
        }
    }

    colorWithConnection(){
        let color, tempCard;
        for (let i = 0; i < this.colorsCards.length; ++i) {
            if(this.colorsCards[i].length === 0)
                continue;
            color = i;
            if (this.typeAndColorMatch(enumCard.enumTypes.PLUS, color, this.different) !== undefined) {
                tempCard = this.typeAndColorMatch(enumCard.enumTypes.PLUS, color, this.equal);
                if (tempCard !== undefined)
                    return color;
            } else if (this.numberOfPlayers === 2) {
                if (this.typeAndColorMatch(enumCard.enumTypes.STOP, color, this.different) !== undefined) {
                    tempCard = this.typeAndColorMatch(enumCard.enumTypes.STOP, color, this.equal);
                    if (tempCard !== undefined)
                        return color;
                }
            }
        }

        return undefined;
    }

    colorWithNumberConnection() {
        let color, tempCard;
        for (let i = 0; i < this.colorsCards.length; ++i) {
            if(this.colorsCards[i].length === 0)
                continue;
            color = i;
            tempCard = this.connectionNumber(color, this.different);
            if (tempCard !== undefined)
                return color;
        }
        return undefined;
    }

    minimumCardsInColor() {
        let minimumLength = undefined;
        for (let i = 0; i < this.colorsCards.length; ++i) {
            if (this.colorsCards[i].length === 0)
                continue;
            if(minimumLength === undefined)
                minimumLength = i;
            else if(this.colorsCards[minimumLength].length > this.colorsCards[i].length)
                minimumLength = i;
        }

        return minimumLength;
    }

    getColorToChange() {
        let color;
        color = this.takiWithConnection();
        if(color !== undefined)
            return color;
        color = this.takiWithNumberConnection();
        if(color !== undefined)
            return color;
        if (this.typesCards[enumCard.enumTypes.TAKI].length > 0) {
            return this.typesCards[enumCard.enumTypes.TAKI][0].getColor();
        }
        color = this.colorWithConnection();
        if(color !== undefined)
            return color;
        color = this.colorWithNumberConnection();
        if(color !== undefined)
            return color;
        color = this.minimumCardsInColor();
        if(color !== undefined)
            return color;
        return enumCard.enumColor.YELLOW;
    }

    clear(){
        super.clear();
        this.colorsCards = [[], [], [], []];
        this.typesCards = [[], [], [], [], [], [], []];
        this.numberOfPlayers = undefined;
        this.lastCardInTaki = undefined;
        this.pickedColor = false;
    }

    setCards(cards){
        this.numberOfPlayers = 2;
        this.setAllCards(cards);
        super.setCardsPlace();
    }

    pullCardFromStock(cardsToAdd){
        this.addCard(cardsToAdd);
    }

    pickCard(lastGameCard){
       return this.operation(lastGameCard);
    }

    resetPlayerClock(){
        return 0;
    }

    calculateAVG() {
        return this.averageTimePlayed;
    }

    doOperation(card, lastCard){
        this.removeAllCardAppearances(card);
        return super.doOperation(card, lastCard);
    }

    isComputer() {
        return true;
    }

    isDraggable() {
        return false;
    }

    pickColor() {
        this.pickedColor = true;
        return enumCard.enumResult.CONTINUE_TURN;
    }

    getColor() {
        this.pickedColor = false;
        return this.getColorToChange();
    }

    colorToPick() {
        return this.pickedColor;
    }
}

module.exports = SmartComputer;