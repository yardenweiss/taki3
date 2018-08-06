import React from 'react';
import ReactDOM from 'react-dom';

export default class ChatInput extends React.Component {
    constructor(args) {
        super(...args);        

        this.state = {
            sendInProgress:false
        };

        this.sendText = this.sendText.bind(this);
    }

    render() {
        return(
            <form className="chat-input-wrapper" onSubmit={this.sendText}>
                <input id = "chatInputArea" disabled={this.state.sendInProgress} placeholder="write something.." ref={input => this.inputElement = input} />
                <input id = "chatSendButton" type="submit" className="btn" disabled={this.state.sendInProgress} value="Send" />
            </form>
        )
    }


    sendText(e) {
        e.preventDefault();
        this.setState(()=>({sendInProgress: true}));
        const text = this.inputElement.value;
        let massage = {text: text, uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        fetch('/chat', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
        .then(response => {            
            if (!response.ok) {                
                throw response;
            }
            this.setState(()=>({sendInProgress: false}));
           this.inputElement.value = '';
        });
        return false;
    }
}