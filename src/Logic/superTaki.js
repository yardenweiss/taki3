const {enumCard} = require('./enumCard');
const Card = require('./card');
const {getUniqueCss} = require('./operations');

class SuperTaki extends Card{

    constructor(theColor, theSign, theId){
        super(theColor, theSign, theId);
        this.direction = enumCard.enumActionDirection.TAKI;
    }

    doOperation(player, lastCard) {
        this.setColor(lastCard.getColor());
        this.setImage(getUniqueCss(Object.keys(enumCard.enumColor)[this.getColor()],
            Object.keys(enumCard.enumTypes)[enumCard.enumTypes.TAKI],'_'));
        player.setTakiMode(this);
        return enumCard.enumResult.CONTINUE_TURN;
    }

    doValidation(lastCard) {
        return !lastCard.isActive();
    }
}

module.exports = SuperTaki;