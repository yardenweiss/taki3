import ReactDOM from 'react-dom';
import React from 'react';
import Card from './card.jsx';

export default class CardHolderReact extends React.Component {
    constructor(args) {
        super(...args);

        this.eachCard = this.eachCard.bind(this);
    }

    eachCard(card, i) {
        return(
            <Card images = {this.props.images} pickColorRef = {this.props.pickColorRef} isDraggable = {this.props.isDraggable} key = {card.id} index = {i} openImg = {this.props.open} image = {card.image} id = {card.id} uniqueID = {this.props.uniqueID} gameName={this.props.gameName}/>
        );
    }

    render() {
        if(this.props.dropCard !== undefined)
            return this.renderWithDrop();
        return this.renderWithoutDrop();

    }

    renderWithoutDrop(){
        return(
            <div className={"player"} id = {this.props.cssId}>
                {this.props.cards.map(this.eachCard)}
            </div>
        );
    }

    renderWithDrop() {
        let anm = Object.keys(this.props.enumReactPosition)[this.props.dropCard.playerID];
        anm = anm.concat("_drop_move 2s");
        return(
            <div className={"player"} id = {this.props.cssId}>
                {this.props.cards.map(this.eachCard)}
                <Card images = {this.props.images} setPull = {this.props.setPull} animationDropCardCss={anm} uniqueID = {this.props.uniqueID} gameName={this.props.gameName} dropCardAnimation ={true} key = {this.props.dropCard.id}/>
            </div>
        );
    }
}