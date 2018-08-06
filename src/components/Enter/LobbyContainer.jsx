import React from 'react';
import ReactDOM from 'react-dom';
import LobbyArea from "./lobbyArea.jsx";
import BoardInput from "./boardInput.jsx";

export default function() {
    return(
        <div className="chat-contaier">
            <LobbyArea boardClickedSuccessHandler={this.props.boardClickedSuccessHandler}/>
            <BoardInput />
        </div>
    )
}