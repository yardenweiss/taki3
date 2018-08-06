import React from 'react';
import ReactDOM from 'react-dom';

export default class LobbyArea extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            users: [],
            boards: [],
            errMessage: ""
        };

        this.getLobbyContent = this.getLobbyContent.bind(this);
        this.boardClicked = this.boardClicked.bind(this);
        this.viewGame = this.viewGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
    }

    componentDidMount() {
        this.getLobbyContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if(this.timeoutErr)
            clearTimeout(this.timeoutErr);
    }

    render() {
        return (
            <div className="converssion-area-wrpper">
                <ul className="converssion-area-wrpper">
                    {this.state.users.map((user, index) => (<li key={100 + index}>{user}</li>))}
                </ul>
                <ul className="toolbar">
                    <li><a className="toolbar-item">Number</a></li>
                    <li><a className="toolbar-item">Created By</a></li>
                    <li><a className="toolbar-item">Title</a></li>
                    <li><a className="toolbar-item">Players Active</a></li>
                    <li><a className="toolbar-item">Players Capacity</a></li>
                    <li><a className="toolbar-item">Viewers</a></li>
                </ul>
                <ul className="lobbyBoards">
                    {this.state.boards.map((board, index) => (
                        <div className="singleBoardInLobby" key={200 + index} style={{background: board.color}}>
                            <li><a className="singleBoardItem" data-key={index}>{index + 1}</a></li>
                            <li><a className="singleBoardItem" data-key={index}>{board.userName}</a></li>
                            <li><a className="singleBoardItem" data-key={index}>{board.gameName}</a></li>
                            <li><a className="singleBoardItem" data-key={index}>{board.registerPlayers}</a></li>
                            <li><a className="singleBoardItem" data-key={index}>{board.numOfPlayers}</a></li>
                            <li><a className="singleBoardItem" data-key={index}>{board.viewers}</a></li>
                            <button className="EnterGameButton" data-key={index} type="button"
                                    disabled={this.state.sendInProgress} onClick={this.boardClicked}>Play Game
                            </button>
                            <button className="ViewGameButton" data-key={index} type="button"
                                    disabled={this.state.sendInProgress} onClick={this.viewGame}>View Game
                            </button>
                            <button className="DeleteGameButton" data-key={index} type="button"
                                    onClick={this.deleteGame}>Delete Game
                            </button>
                        </div>
                    ))}
                </ul>
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            </div>
        )
    }

    getLobbyContent() {
        return fetch('/lobby', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getLobbyContent, 2000);
                return response.json();
            })
            .then(content => {
                this.setState(() => ({boards: content.boards, users: content.users}));
            })
            .catch(err => {
                throw err
            });
    }

    viewGame(e) {
        e.preventDefault();
        this.setState(() => ({sendInProgress: true}));
        let index = e.target.getAttribute('data-key');
        let boardDetail = this.state.boards[index];
        return fetch('/lobby/viewGame', {
            method: 'POST',
            body: JSON.stringify(boardDetail),
            credentials: 'include'
        })
        .then((response) => {
            if (!response.ok) {
                this.setState(() => ({errMessage: response.statusText}));
            }
            this.setState(() => ({sendInProgress: false}));
            return response.json();
        })
        .then(content => {
            this.setState(() => ({errMessage: ""}));
            this.props.viewGameSuccessHandler(content.boardDetail);
        })
    }

    deleteGame(e){
        e.preventDefault();
        this.setState(() => ({sendInProgress: true}));
        let index = e.target.getAttribute('data-key');
        let boardDetail = this.state.boards[index];
        return fetch('/lobby/deleteGame', {
            method: 'POST',
            body: JSON.stringify(boardDetail),
            credentials: 'include'
        })
        .then((response) => {
            if (!response.ok) {
                this.setState(() => ({errMessage: response.statusText}));
            }else
                return response.json();
        })
        .then(content => {
            if(content){
                if(this.timeoutErr)
                    clearTimeout(this.timeoutErr);
                this.timeoutErr = setTimeout((() => this.setState(()=>({errMessage:  ""}))), 5000);
                this.setState(()=>(content));
            }
        })
    }

    boardClicked(e) {
        e.preventDefault();
        this.setState(() => ({sendInProgress: true}));
        let index = e.target.getAttribute('data-key');
        let boardDetail = this.state.boards[index];
        return fetch('/lobby/boardClicked', {
            method: 'POST',
            body: JSON.stringify(boardDetail),
            credentials: 'include'
        })
            .then((response) => {
                if (!response.ok) {
                    this.setState(() => ({errMessage: response.statusText}));
                }else
                    return response.json();
            })
            .then(content => {
                if(content.errMessage === undefined){
                    this.setState(() => ({errMessage: ""}));
                    this.props.boardClickedSuccessHandler(content.boardDetail);
                }else {
                    if(this.timeoutErr)
                        clearTimeout(this.timeoutErr);
                    this.timeoutErr = setTimeout((() => this.setState(()=>({errMessage:  ""}))), 5000);
                    this.setState(() => (content));
                }
            })
    }
}