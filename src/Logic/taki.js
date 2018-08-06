const {enumCard} = require('./enumCard');
const Card = require('./card');

class Taki extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
        this.direction = enumCard.enumActionDirection.TAKI;
    }

    doOperation(player) {
        player.setTakiMode(this);
        return enumCard.enumResult.CONTINUE_TURN;
    }

    doValidation(lastCard) {
        return !lastCard.isActive() && (lastCard.getColor() === this.getColor());
    }
}

module.exports = Taki;