import ReactDOM from 'react-dom';
import React from 'react';
export default class Card extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            bold: false,
        };
        this.onDragStart = this.onDragStart.bind(this);
        this.fetchError = this.fetchError.bind(this);
        this.mouseover = this.mouseover.bind(this);
        this.onmouseout = this.onmouseout.bind(this);
        this.endPullCardAnimation = this.endPullCardAnimation.bind(this);
        this.endDropCardAnimation = this.endDropCardAnimation.bind(this);
    }

    onDragStart(ev) {
        let changeColorReact = this.props.pickColorRef.current;
        if(changeColorReact.props.visible === "visible"){
            this.fetchError();
            return false;
        }
        ev.dataTransfer.setData("Text", this.props.id);
    }

    fetchError() {
        let massage = {uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        return fetch('/game/cardError', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
    }

    render() {
        if(this.props.pullCardAnimation !== undefined) {
                return this.pullCardAnm();
        } else if(this.props.dropCardAnimation !== undefined){
            return this.dropCardAnm();
        }
        else {
            if (!this.state.bold)
                return this.renderWithoutBold();
            else
                return this.renderWithBold();
        }
    }

        endDropCardAnimation(){
        let massage = {uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        return fetch('/game/finishAnimation', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
        .then(() => {
            this.props.setPull();
        });
    }

    endPullCardAnimation(){
        let massage = {uniqueID: this.props.uniqueID, gameName: this.props.gameName};

        return fetch('/game/animationCardEnd', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
        .then(() => {
            this.props.setPull();
        });
    }

    pullCardAnm(){
        return(
            <a id="regular">
                <img id="endPullCardAnm" onAnimationEnd={this.endPullCardAnimation} style={{transition: "0.4s",animation: this.props.animationPullCardCss, position: "fixed"}} draggable={false} src={this.props.images["close_card.png"]}/>
            </a>
        );
    }


    dropCardAnm(){
        return(
            <a id="regular">
                <img id="endPullCardAnm" onAnimationEnd={this.endDropCardAnimation} style={{transition: "0.4s",animation: this.props.animationDropCardCss, position: "fixed"}} draggable={false} src={this.props.images["close_card.png"]}/>
            </a>
        );
    }

    renderWithBold(){
        return(
            <a id= "bold">
                <img onMouseEnter={this.mouseover} onMouseOut={this.onmouseout}
                     draggable={this.props.isDraggable} onDragStart={this.onDragStart}
                     src={this.props.openImg? this.props.images[this.props.image] : this.props.images["close_card.png"]}/>
            </a>
        );
    }

    renderWithoutBold(){
        return(
            <a id="regular">
                <img onMouseEnter={this.mouseover} onMouseOut={this.onmouseout}
                     draggable={this.props.isDraggable} onDragStart={this.onDragStart}
                     src={this.props.openImg? this.props.images[this.props.image] : this.props.images["close_card.png"]}/>
            </a>
        );
    }

    mouseover(){
        if(this.props.isDraggable){
            this.setState({bold: true});
        }
    }

    onmouseout(){
        if(this.props.isDraggable){
            this.setState({bold: false});
        }
    }
}