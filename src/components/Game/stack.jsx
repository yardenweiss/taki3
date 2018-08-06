import React from 'react';
import ReactDOM from 'react-dom';
import Card from './card.jsx';

export default class Stack extends React.Component {
    constructor(args) {
        super(...args);
        this.handleClick = this.handleClick.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.eachCard = this.eachCard.bind(this);
    }

    eachCard(card, i) {
        let anm = Object.keys(this.props.enumReactPosition)[card.playerID];
        anm = anm.concat("_move 2s");
        return(
            <Card images = {this.props.images} setPull = {this.props.setPull} animationPullCardCss={anm} uniqueID = {this.props.uniqueID} gameName={this.props.gameName} pullCardAnimation ={true} key = {i + 400}/>
        );
    }

    render() {
        return(
            <div onClick={this.handleClick} id = {"stockCards"}>
                <img draggable={false} src={this.props.images[this.props.img]}/>
                {this.props.cards.map(this.eachCard)}
            </div>
        );
    }

    handleClick() {
        if(this.props.openCardAnm || this.props.cards.length > 0)
            return false;
        if(this.props.interactive === false)
            return false;
        let changeColorReact = this.props.pickColorRef.current;
        if (changeColorReact.props.visible === "visible")
            return false;
        let massage = {uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        return fetch('/game/pullCard', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
    }

    dragStart() {
         return false;
    }
}