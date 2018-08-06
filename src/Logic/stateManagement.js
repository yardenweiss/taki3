const PlayerManagement = require('./playerManagment');
const {enumCard} = require('./enumCard');

class  StateManagement{
    constructor(){
        this.playersCards = [];
        this.playerManagement = [];
        this.viewerManagement = [];
        this.stackImage = undefined;
        this.gameState =  "start";
        this.winMessage =  undefined;
        this.setStartGame = this.setStartGame.bind(this);
    }

    setStartGame(game, players){
        this.game = game;
        for(let i = 0; i < players; ++i) {
            this.playerManagement.push(new PlayerManagement());
            this.playerManagement[i].turn = i;
        }
        this.game.setManager(this);
        this.gameState = "gaming";
        this.game.startGame();
    }

    getUserDetails(uniqueID, viewerName){
        if(uniqueID >= 4){
            for(let i = 0; i < this.viewerManagement.length; ++i){
                if(viewerName === this.viewerManagement[i].name){
                    return this.viewerManagement[i];
                }
            }
        }
        return this.playerManagement[uniqueID];
    }

    addViewer(viewerName){
        this.viewerManagement.push(new PlayerManagement());
        this.viewerManagement[this.viewerManagement.length - 1].name = viewerName;
        this.viewerManagement[this.viewerManagement.length - 1].message = this.winMessage;
        this.viewerManagement[this.viewerManagement.length - 1].gameState = this.gameState;
        let card = this.game.gameCards[this.game.gameCards.length -1];
        this.viewerManagement[this.viewerManagement.length - 1].openCard = {image: card.uniqueCardImage, id: card.id};
        this.game.gameStatistics.updateViewerStatistics(this.game.turn,
            this.game.stack.getAllCards().length);

    }

    removeViewer(viewerName){
        for(let i = 0; i < this.viewerManagement.length; ++i){
            if(viewerName === this.viewerManagement[i].name){
                this.viewerManagement.splice(i, 1);
                break;
            }
        }
    }

    updateDirection(card, playerID){
        this.playerManagement.forEach(p=> p.direction = []);
        if (card.sign === enumCard.enumTypes.TWO_PLUS)
            this.playerManagement[(playerID + 1) % this.playerManagement.length].direction = card.direction;
        else if(card.sign === enumCard.enumTypes.CHANGE_DIR)
            this.playerManagement.forEach(p => p.direction = card.direction);
        else
            this.playerManagement[playerID].direction = card.direction;
    }

    deletePlayerCard(card,playerID){
        for(let i = 0; i < this.playersCards[playerID].length; ++i){
            if (this.playersCards[playerID][i].id === card.id) {
                this.playersCards[playerID].splice(i, 1);
                break;
            }
        }
    }

    endGame(message){
        let clone = this.clone();
        this.playerManagement.forEach(p => p.savesStates.push(clone));
        this.game.gameStatistics.allPlayersStatistics();
        this.playerManagement.forEach(p => {
            p.showResults = true;
            p.error = [];
            p.message = message;
            p.gameState =  "endGame";
            p.turnIndex = p.savesStates.length - 1;
        });

        this.viewerManagement.forEach(v => {
            v.gameState =  "endGame";
            v.message = message;
        });
        this.winMessage = message;
        this.gameState =  "endGame";
    }

    clone(){
        let cloneState = new StateManagement();
        cloneState.playersCards = [];
        for(let i = 0;i < this.playerManagement.length;++i){
            cloneState.playersCards[i] = [];
            for(let j=0; j< this.playersCards[i].length;++j){
                cloneState.playersCards[i].push(this.playersCards[i][j]);
            }
            cloneState.playerManagement.push(this.playerManagement[i].clone());
        }
        cloneState.stackImage = this.stackImage;
        return cloneState;
    }
}

    module.exports = StateManagement;