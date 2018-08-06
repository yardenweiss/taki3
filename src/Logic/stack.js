const {enumCard} = require('./enumCard');
const {getUniqueCss} = require('./operations');
const ChangeColorCard = require('./changeColorCard');
const NumberCard = require('./numberCard');
const Plus = require('./plus');
const ChangeDirection = require('./changeDirection');
const Stop = require('./stop');
const SuperTaki = require('./superTaki');
const Taki = require('./taki');
const TwoPlus = require('./twoPlus');

class Stack{
    constructor() {
        this.cards = [];
        this.twoCardsNumber = [1, 3, 4, 5, 6, 7, 8, 9];
        this.colorNumber = [enumCard.enumColor.RED, enumCard.enumColor.BLUE,
            enumCard.enumColor.GREEN, enumCard.enumColor.YELLOW];
        this.id = 0;
        this.css = undefined;
    }

    createDeck() {
        for (let number = 0; number < this.twoCardsNumber.length; ++number) {
            for (let color = 0; color < this.colorNumber.length; ++color) {
                this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], this.twoCardsNumber[number].toString(), '_');
                this.cards.push(new NumberCard(this.colorNumber[color], enumCard.enumTypes.NUMBER, this.id++));
                this.cards[this.cards.length - 1].number = this.twoCardsNumber[number];
                this.cards[this.cards.length - 1].setElement(this.css);

                this.cards.push(new NumberCard(this.colorNumber[color], enumCard.enumTypes.NUMBER, this.id++));
                this.cards[this.cards.length - 1].number = this.twoCardsNumber[number];
                this.cards[this.cards.length - 1].setElement(this.css);
            }
        }

        for (let color = 0; color < this.colorNumber.length; ++color) {

            this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], Object.keys(enumCard.enumTypes)[enumCard.enumTypes.CHANGE_DIR], '_');
            this.cards.push(new ChangeDirection(this.colorNumber[color], enumCard.enumTypes.CHANGE_DIR, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
            this.cards.push(new ChangeDirection(this.colorNumber[color], enumCard.enumTypes.CHANGE_DIR, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);


            this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], Object.keys(enumCard.enumTypes)[enumCard.enumTypes.TAKI], '_');
            this.cards.push(new Taki(this.colorNumber[color], enumCard.enumTypes.TAKI, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
            this.cards.push(new Taki(this.colorNumber[color], enumCard.enumTypes.TAKI, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);



            this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], Object.keys(enumCard.enumTypes)[enumCard.enumTypes.STOP], '_');
            this.cards.push(new Stop(this.colorNumber[color], enumCard.enumTypes.STOP, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
            this.cards.push(new Stop(this.colorNumber[color], enumCard.enumTypes.STOP, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);


            this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], Object.keys(enumCard.enumTypes)[enumCard.enumTypes.TWO_PLUS], '_');
            this.cards.push(new TwoPlus(this.colorNumber[color], enumCard.enumTypes.TWO_PLUS, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
            this.cards.push(new TwoPlus(this.colorNumber[color], enumCard.enumTypes.TWO_PLUS, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);

            this.css = getUniqueCss(Object.keys(enumCard.enumColor)[color], Object.keys(enumCard.enumTypes)[enumCard.enumTypes.PLUS], '_');
            this.cards.push(new Plus(this.colorNumber[color], enumCard.enumTypes.PLUS, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
            this.cards.push(new Plus(this.colorNumber[color], enumCard.enumTypes.PLUS, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);

            this.css = getUniqueCss('', Object.keys(enumCard.enumTypes)[enumCard.enumTypes.CHANGE_COLOR], '');
            this.cards.push(new ChangeColorCard(undefined, enumCard.enumTypes.CHANGE_COLOR, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
        }

        this.css = getUniqueCss('', Object.keys(enumCard.enumTypes)[enumCard.enumTypes.SUPER_TAKI], '');
        for (let color = 0; color < 2; ++color) {
            this.cards.push(new SuperTaki(undefined, enumCard.enumTypes.SUPER_TAKI, this.id++));
            this.cards[this.cards.length - 1].setElement(this.css);
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleDeck(shuffleCnt) {
        if (3 * shuffleCnt > this.cards.length - 1)
            shuffleCnt = (this.cards.length - 1) / 3;
        for (let i = 0; i < 3 * shuffleCnt; i++) {
            let rndNo = this.getRandomInt(0, this.cards.length - 1);
            let Card = this.cards[i];
            this.cards[i] = this.cards[rndNo];
            this.cards[rndNo] = Card;
        }
    }

    getCards(number) {
        return this.cards.splice(0, number);
    }

    setGame() {
        this.createDeck();
        this.shuffleDeck(this.getRandomInt(10, 25));
    }

    getValidOpenCard() {
        for (let i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].getSign() === enumCard.enumTypes.NUMBER) {
                return this.cards.splice(i, 1);
            }
        }
        return undefined;
    }

    initializeStock(allCards) {
        for (let i = 0; i < allCards.length; ++i) {
            if (allCards[i].getSign() === enumCard.enumTypes.CHANGE_COLOR || allCards[i].getSign() === enumCard.enumTypes.SUPER_TAKI) {
                allCards[i].setColor(undefined);
                this.css = getUniqueCss("", Object.keys(enumCard.enumTypes)[allCards[i].getSign()], '');
            }
            else if (allCards[i].number === undefined)
                this.css = getUniqueCss(Object.keys(enumCard.enumColor)[allCards[i].getColor()], Object.keys(enumCard.enumTypes)[allCards[i].getSign()], '_');
            else
                this.css = getUniqueCss(Object.keys(enumCard.enumColor)[allCards[i].getColor()], allCards[i].number, '_');
            allCards[i].setElement(this.css);

            this.cards.push(allCards[i]);
        }
        this.shuffleDeck(this.getRandomInt(10, 25));
    }

    getLength() {
        return this.cards.length;
    }

    getAllCards() {
        return this.cards;
    }

    getStackImage() {
        let img;
        if (this.cards.length > 30) {
            img = enumCard.images.MANY_CLOSE_CARDS;
        }
        else if (this.cards.length > 10) {
            img = enumCard.images.FEW_CLOSE_CARDS;

        }
        else {
            img = enumCard.images.CLOSE_CARD;
        }

        return img;
    }
}

module.exports = Stack;
