const Card = require('./card');
const {enumCard} = require('./enumCard');


class NumberCard extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
    }

    doOperation() {
        return enumCard.enumResult.NEXT_TURN;
    }

    doValidation(lastCard) {
        return !lastCard.isActive() && (lastCard.getColor() === this.getColor() || lastCard.number === this.number);
    }
}

module.exports = NumberCard;