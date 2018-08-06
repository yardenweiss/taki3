import React from 'react';
import ReactDOM from 'react-dom';
import takiImage from './resources/taki_logo.png';

export default class LoginModal extends React.Component {
    constructor(args) {
        super(...args);

        this.state ={
            errMessage: ""
        };

        this.handleLogin = this.handleLogin.bind(this);

    }

    componentWillUnmount() {
        if(this.timeoutErr)
            clearTimeout(this.timeoutErr);
    }
    
    render() {
        return (
            <div className="login-page-wrapper">

                <form onSubmit={this.handleLogin}>
                    <label className="username-label" htmlFor="userName"> Name: </label>
                    <input className="username-input" name="userName"/>                        
                    <input className="submit-btn btn" type="submit" value="Login"/>
                </form>
                {this.renderErrorMessage()}
            </div>
        );
    }

    renderErrorMessage() {
        if (this.state.errMessage !== "") {
            return (
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleLogin(e) {
        e.preventDefault();
        const userName = e.target.elements.userName.value;
        return fetch('/users/addUser', {method:'POST', body: userName, credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    this.setState(() => ({errMessage: response.statusText}));
                }else
                    return response.json();
            })
            .then(content => {
                if(content.errMessage.length === 0){
                    this.setState(() => ({errMessage: ""}));
                    this.props.loginSuccessHandler();
                }else {
                    if(this.timeoutErr)
                        clearTimeout(this.timeoutErr);
                    this.timeoutErr = setTimeout((() => this.setState(()=>({errMessage:  ""}))), 5000);
                    this.setState(() => (content));
                }
            })
    }    
}