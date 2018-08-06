import React from 'react';
import ReactDOM from 'react-dom';

export default class chatArea extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            content: []
        };

        this.getChatContent = this.getChatContent.bind(this);
    }

    componentDidMount() {
        this.getChatContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {
        return(
            <div id="chatWindow">
                {this.state.content.map((line, index) => (<p key={line.user.name + index}> {line.user.name}:  {line.text}</p>))}
            </div>
        )
    }

    getChatContent() {
        let massage = {uniqueID: this.props.uniqueID,
            gameName: this.props.gameName};
        return fetch('/chat/pull', {
            method: 'POST',
            body: JSON.stringify(massage),
            credentials: 'include'
        })
            .then((response) => {
                if (!response.ok){
                    throw response;
                }
                this.timeoutId = setTimeout(this.getChatContent, 200);
                return response.json();
            })
            .then(content => {
                this.setState(()=>({content}));
            })
            .catch(err => {throw err});
    }
}