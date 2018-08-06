const Card = require('./card');
const {enumCard} = require('./enumCard');

class ChangeColorCard extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
        this.direction = enumCard.enumActionDirection.CHANGE_COLOR;
    }

    doOperation(player) {
        return player.pickColor();
    }

    doValidation(lastCard) {
        return !lastCard.isActive();
    }
}

module.exports = ChangeColorCard;