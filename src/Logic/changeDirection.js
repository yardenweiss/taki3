const {enumCard} = require('./enumCard');
const Card = require('./card');


class ChangeDirection extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
        this.direction = enumCard.enumActionDirection.CHANGE_DIR;
    }

    doOperation() {
        return enumCard.enumResult.CHANGE_DIR;
    }

    doValidation(lastCard) {
        return !lastCard.isActive() && (lastCard.getColor() === this.getColor() || lastCard.getSign() === this.getSign());
    }
}

module.exports = ChangeDirection;