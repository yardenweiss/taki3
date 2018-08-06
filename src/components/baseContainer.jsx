import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import LobbyArea from './Enter/lobbyArea.jsx';
import BoardInput from './Enter/boardInput.jsx';
import Board from './Game/board.jsx';
import PreGame from './Game/open.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            room3: false,
            room4: false,
            showLogin: true,
            currentUser: {
                name: ''
            }
        };

        this.logOutHandler = this.logOutHandler.bind(this);
        this.handleSuccessLogin = this.handleSuccessLogin.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.boardClickedSuccessHandler = this.boardClickedSuccessHandler.bind(this);
        this.viewGameSuccessHandler = this.viewGameSuccessHandler.bind(this);
        this.enterGameHandler = this.enterGameHandler.bind(this);
        this.enterViewerGame = this.enterViewerGame.bind(this);
        this.exitGame = this.exitGame.bind(this);
        this.getUserStataus();
    }
    
    render() {
        if(this.state.room4)
            return this.renderRoom4();
        else if(this.state.room3){
            return this.renderRoom3();
        }else if (this.state.showLogin) {
            return (<LoginModal loginSuccessHandler={this.handleSuccessLogin}/>)
        }
        return this.renderRoom2();
    }


    handleSuccessLogin() {
        this.setState(()=>({showLogin: false}), this.getUserName);
    }

    logOutHandler(){
        return fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.setState(()=>({showLogin: true}));
        })
        .catch(err => {throw err});
    }

    boardClickedSuccessHandler(boardDetail){
        this.setState(()=>({viewer: false, room3: true, boardDetail: boardDetail}));
    }

    viewGameSuccessHandler(boardDetail){
        if(boardDetail.registerPlayers === boardDetail.numOfPlayers)
            this.enterViewerGame(boardDetail);
        else
            this.setState(()=>({viewer: true, room3: true, boardDetail: boardDetail}));
    }

    enterViewerGame(boardDetail){
        return fetch('/game', {
            method: 'POST',
            body: JSON.stringify(boardDetail),
            credentials: 'include'
        })
        .then((response) => {
            if (!response.ok){
                this.setState(()=> ({errMessage: response.statusText}));
            }
            return response.json();
        })
        .then(content => {
            this.setState(()=>({room4: true, room3: false, myIndex: content.uniqueId, enumCard: content.enumCard, enumColor: content.enumColor, viewer: true, boardDetail: boardDetail}));
        })
    }

    enterGameHandler(boardDetail){
        return fetch('/game', {
            method: 'POST',
            body: JSON.stringify(boardDetail),
            credentials: 'include'
        })
            .then((response) => {
                if (!response.ok){
                    this.setState(()=> ({errMessage: response.statusText}));
                }
                return response.json();
            })
            .then(content => {
                this.setState(()=>({room4: true, room3: false, myIndex: content.uniqueId, enumCard: content.enumCard, enumColor: content.enumColor}));
            })
    }

    getUserName() {
        return fetch('/users',{method: 'GET', credentials: 'include'})
            .then(response => {
                if (response.ok){
                    let userInfo = response.json();
                    this.setState(()=>({currentUser: userInfo, showLogin: false}));
                }else{
                    this.setState(()=>({currentUser: {name: ''}, showLogin: true}));
                }
            });
    }


    getUserStataus() {
        return fetch('/users/userStatus',{method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok){
                    this.setState(()=> ({errMessage: response.statusText}));
                }
                return response.json();
            })
            .then(content => {
                this.setState(()=>(content));
            })
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {
            if (response.ok){
                return response.json();
            }
            return response.json();
        });
    }

    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(() => {
            this.setState(()=>({currentUser: {name:''}, showLogin: true}));
        })
    }

    renderRoom3() {
        return(
            <PreGame exitGame = {this.exitGame} viewer = {this.state.viewer} viewGameSuccessHandler = {this.viewGameSuccessHandler} enterGameHandler = {this.enterGameHandler} boardDetail = {this.state.boardDetail}/>
        )
    }

    renderRoom2() {
        return(
            <div className="chat-contaier">
                <button id="Quit_Game" type="button" style={{width: "100px", visibility : "visible"}} onClick={this.logOutHandler}>Logout</button>
                <LobbyArea viewGameSuccessHandler = {this.viewGameSuccessHandler} boardClickedSuccessHandler={this.boardClickedSuccessHandler}/>
                <BoardInput />
            </div>
        )
    }

    exitGame(){
        let massage = {gameName: this.state.boardDetail.gameName,
            uniqueID : this.state.myIndex};
        fetch('/game/finishGame', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
        .then(response => {
            if (response.ok){
                this.setState(()=>({room3: false, room4: false, showLogin: false}));
            }
        });
    }

    renderRoom4() {
        return(
            <Board viewer = {this.state.viewer} exitGame = {this.exitGame} enumReactPosition = {this.state.enumCard} enumColor = {this.state.enumColor} uniqueID = {this.state.myIndex} gameName = {this.state.boardDetail.gameName}/>
        )
    }
}
