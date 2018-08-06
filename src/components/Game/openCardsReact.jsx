import React from 'react';
import ReactDOM from 'react-dom';

export default class OpenCardsReact extends React.Component {
    constructor(args) {
        super(...args);
        this.Drop = this.Drop.bind(this);
    }

    render() {
        return(
            <div onDragOver={this.allowDrop} onDrop = {this.Drop} id = {"openCards"}>
                <img draggable={false} src={this.props.images[this.props.card.image]}/>
            </div>
        );
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    Drop(ev) {
        if(this.props.anm || this.props.pullCardAnm)
            return false;
        let id = ev.dataTransfer.getData("Text");
        let massage = {id: id, uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        return fetch('/game/setDrop', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
    }
}