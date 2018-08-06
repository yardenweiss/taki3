import React from 'react';
import ReactDOM from 'react-dom';
import Stack from './stack.jsx'
import takiImage from './../resources/taki_logo.png';
import CloseCards from './../../Images/other/many_close_cards.png'

export default class LobbyArea extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            boardDetail: undefined
        };

        this.getBoardContent = this.getBoardContent.bind(this);
        this.firstRender = this.firstRender.bind(this);
        this.secondRender = this.secondRender.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount(){
        this.getBoardContent();
    }

    render(){
        if(this.state.boardDetail === undefined)
            return this.firstRender();
        return this.secondRender();
    }

    secondRender() {
        let computer = this.state.boardDetail.computer;
        if (computer)
            computer = "Computer";
        return (
            <div>
                <div className="login-page-wrapper">
                    <img className="taki-logo" src={takiImage}/>
                </div>
                <div className="container-PreGame">
                    <h2>Taki Game: {this.state.boardDetail.gameName}</h2>
                    <h3>Waiting
                        for {this.state.boardDetail.numOfPlayers - this.state.boardDetail.registerPlayers} players</h3>
                    <h2>Currently Register Players:</h2>
                    <ul className="registerUsers">
                        {this.state.boardDetail.users.map((user, index) => (<li key={100 + index}>{user}</li>))}
                    </ul>
                    <ul className="registerUsers">
                        <li>{computer}</li>
                    </ul>

                    <h2>Currently Viewers:</h2>
                    <ul className="registerUsers">
                        {this.state.boardDetail.viewers.map((user, index) => (<li key={100 + index}>{user}</li>))}
                    </ul>
                    <button id="Quit_Game" type="button" style={{visibility: "visible"}} onClick={this.logOut}>Logout</button>
                </div>
            </div>
        );
    }

    firstRender() {
        return(
            <div className="container-fluid">
            </div>
        );
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getBoardContent() {
        return fetch('/lobby/getBoard', {
            method: 'POST',
            body: this.props.boardDetail.gameName,
            credentials: 'include'
        })
        .then((response) => {
            if (!response.ok){
                this.setState(()=> ({errMessage: response.statusText}));
            }
            this.timeoutId = setTimeout(this.getBoardContent, 2000);
            return response.json();
        })
        .then(content => {
            if (content.boardDetail.registerPlayers === content.boardDetail.numOfPlayers)
            {
                if(this.props.viewer)
                    this.props.viewGameSuccessHandler(content.boardDetail);
                else
                    this.props.enterGameHandler(content.boardDetail);
            }
            this.setState(()=> ({boardDetail: content.boardDetail}));
        })
    }

    logOut() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.props.exitGame();
    }
}