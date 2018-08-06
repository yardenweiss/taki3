import React from 'react';
import ReactDOM from 'react-dom';

export default class Statistics extends React.Component {
    constructor(args) {
        super(...args);
    }

    render()
    {
        let messages = this.props.msg;
        let turnPlayed = messages[0];
        let currentPlayerTurn  = messages[1];
        messages = messages.slice(2,messages.length);
        if(this.props.endGame !== undefined){
            return(
                <div id = {"statistics"}>
                    <h2>Statistics:</h2>
                    <h3>Game Statistics:</h3>
                    <p>{currentPlayerTurn}</p>
                    <p>{turnPlayed}</p>
                    {messages.map(this.eachMassage)}
                </div>
            );
        }
        return(
            <div id = {"statistics"}>
                <h2>Statistics:</h2>
                <h3>Game Statistics:</h3>
                <div id = {"CurrentTurn"}>
                    <p>{currentPlayerTurn}</p>
                </div>
                <p>{turnPlayed}</p>
                {messages.map(this.eachMassage)}
            </div>
        );
    }

    eachMassage(msg, i) {
        return(
            <p key={i + 200}>{msg}</p>
        );
    }
}