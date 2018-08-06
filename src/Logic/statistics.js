class statistics {

    constructor(thePlayersGame) {
        this.playersGame = thePlayersGame;
        this.legacyPlayers = [];
        this.turnsCounter = -1;
    }

    updateStatistics(turn, cardLength) {
        this.turnsCounter++;
        let playerTurnName = "Current player turn: " + this.playersGame[turn].name;
        let amountOfCardsInStack = "Amount cards In stack: " + cardLength;
        for (let i = 0; i < this.manager.playerManagement.length; ++i) {
            let messages = [];
            messages[0] = "\n" + "Turns played totally :" + this.turnsCounter;
            messages.push(playerTurnName);
            messages.push(amountOfCardsInStack);
            let indexTurn = this.manager.playerManagement[i].turn;
            if(this.manager.playerManagement[i].gameState !== "stopGaming") {
                let playerLocal = this.playersGame[indexTurn].name + ": ";
                messages.push(playerLocal);
                playerLocal = "Turns played: " + this.playersGame[indexTurn].getTurnsPlayed();
                messages.push(playerLocal);
                playerLocal = "Single cards times: " + this.playersGame[indexTurn].getSingleCardCounter();
                messages.push(playerLocal);
                playerLocal = "Average turn time: " + Math.round(this.playersGame[indexTurn].getAverageTimePlayed() * 100) / 100 + " sec";
                messages.push(playerLocal);
            }
            this.manager.playerManagement[i].statisticsMassages = [];
            this.manager.playerManagement[i].statisticsMassages = messages;
        }
        this.updateViewerStatistics(turn,cardLength);
    }

    updateViewerStatistics(turn,cardLength){
        let messages = [];
        messages[0] = "\n" + "Turns played totally :" + this.turnsCounter;
        let playerTurnName = "Current player turn: " + this.playersGame[turn].name;
        let amountOfCardsInStack = "Amount cards In stack: " + cardLength;
        messages.push(playerTurnName);
        messages.push(amountOfCardsInStack);
        this.manager.viewerManagement.forEach(v => v.statisticsMassages = messages);
    }

    allPlayersStatistics() {
        let messages = [];
        this.turnsCounter++;
        messages[0] = "\n" + "Turns played totally :" + this.turnsCounter;
        for (let i = 0; i < this.playersGame.length; ++i) {
            let playerLocal = this.playersGame[i].name;
            messages.push(playerLocal);
            playerLocal = "Turns played: " + this.playersGame[i].getTurnsPlayed();
            messages.push(playerLocal);
            playerLocal = "Single cards times: " + this.playersGame[i].getSingleCardCounter();
            messages.push(playerLocal);
            playerLocal = "Average turn time: " + Math.round(this.playersGame[i].getAverageTimePlayed() * 100) / 100 + " sec";
            messages.push(playerLocal);
        }

        for (let i = 0; i < this.legacyPlayers.length; ++i) {
            let playerLocal = this.legacyPlayers[i].name;
            messages.push(playerLocal);
            playerLocal = "Turns played: " + this.legacyPlayers[i].turnsPlayed;
            messages.push(playerLocal);
            playerLocal = "Single cards times: " + this.legacyPlayers[i].singleCardCounter;
            messages.push(playerLocal);
            playerLocal = "Average turn time: " + Math.round(this.legacyPlayers[i].averageTimePlayed * 100) / 100 + " sec";
            messages.push(playerLocal);
        }

        this.manager.allStatisticsMassages = [];
        this.manager.playerManagement.forEach(p => p.allStatisticsMassages = messages);
        this.manager.viewerManagement.forEach(v => v.allStatisticsMassages = messages);
    }

    setManager(statisticsManager) {
        this.manager = statisticsManager;
    }
}

module.exports = statistics;