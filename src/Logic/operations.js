
function takiModeChecker(cards, takiMode)
{
    let foundColor = false;
    for (let i = 0; i < cards.length; ++i) {
        if (cards[i].getColor() === takiMode.getColor()) {
            foundColor = true;
            break;
        }
    }

    return foundColor;
}

function getUniqueCss(color, type, separator) {
    return color.concat(separator).concat(type);
}

function setCards(stock, cards) {
    for (let i = 0; i < cards.length; ++i) {
        stock.push(cards[i]);
    }
}

function takeCards(stock, cardsToTake) {
    for (let i = 0; i < cardsToTake.length; ++i) {
        stock.push(cardsToTake[i]);
    }
}

function takiPermission(player, card) {
    let taki = player.getTakiMode();
    return (taki === undefined || (taki !== undefined && taki.getColor() === card.getColor()));
}

module.exports.takiModeChecker = takiModeChecker;
module.exports.getUniqueCss = getUniqueCss;
module.exports.setCards = setCards;
module.exports.takeCards = takeCards;
module.exports.takiPermission = takiPermission;
