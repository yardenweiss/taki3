const {enumCard} = require('./enumCard');
const Card = require('./card');


class Stop extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
        this.direction = enumCard.enumActionDirection.STOP;
    }

    doOperation() {
        return enumCard.enumResult.JUMP_TURN;
    }

    doValidation(lastCard) {
        return !lastCard.isActive() && (lastCard.getColor() === this.getColor() || lastCard.getSign() === this.getSign());
    }
}

module.exports = Stop;