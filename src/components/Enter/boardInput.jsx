import React from 'react';
import ReactDOM from 'react-dom';

export default class BoardInput extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            sendInProgress: false,
        };
        this.addBoard = this.addBoard.bind(this);
    }

    componentWillUnmount() {
        if(this.timeoutErr)
            clearTimeout(this.timeoutErr);
    }

    render() {
        return (
            <div className="converssion-area-wrpper">
                <h2>New Board:</h2>
                <form className="chat-input-wrapper" onSubmit={this.addBoard}>
                    <input disabled={this.state.sendInProgress} placeholder="enter game name here"
                           ref={input => this.inputElement = input}/>
                    <select className="amountOfPlayers" disabled={this.state.sendInProgress} ref={input => this.numPlayers = input}>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <label id="checkbox1">
                        <label className="ComputerLabel">Coumputer</label>
                        <input type="checkbox" disabled={this.state.sendInProgress}
                               placeholder="enter number of players" ref={input => this.computer = input}/>
                    </label>
                    <input type="submit" className="btn" disabled={this.state.sendInProgress} value="Send"/>
                </form>
                    {this.renderErrorMessage()}
            </div>
        )
    }


    renderErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }


    addBoard(e) {
        e.preventDefault();
        this.setState(() => ({sendInProgress: true}));
        const gameName = this.inputElement.value;
        const numOfPlayers = parseInt(this.numPlayers.value);
        const computer = this.computer.checked;
        let text = {gameName: gameName, numOfPlayers: numOfPlayers, computer: computer};
        return fetch('/lobby', {
            method: 'POST',
            body: JSON.stringify(text),
            credentials: 'include'
        })
        .then((response) => {
            this.inputElement.value = '';
            if (!response.ok) {
                this.setState(() => ({errMessage: response.statusText}));
            }else
                return response.json();
        })
        .then(content => {
            if(this.timeoutErr)
                clearTimeout(this.timeoutErr);
            this.timeoutErr = setTimeout((() => this.setState(()=>({errMessage:  ""}))), 5000);
            this.setState(() => (content));
        })
    }
}