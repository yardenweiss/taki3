import React from 'react';
import ReactDOM from 'react-dom';

export default class Clock extends React.Component {

    constructor(args) {
        super(...args);
        this.state = {
            hours : 0,
            minutes : 0,
            seconds : 0
        };
        this.updateTime = this.updateTime.bind(this);
        this.intervalID = setInterval(() => this.updateTime(1), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }



    updateTime(secs) {
        let seconds = this.state.seconds;
        let minutes = this.state.minutes;
        let hours = this.state.hours;

        seconds += secs;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }

        if (minutes >= 60) {
            hours++;
            minutes = 0;
        }
        if (hours >= 24) {
            hours = 0;
        }
        this.setState({
            hours : hours,
            minutes : minutes,
            seconds : seconds
        });
    }

    render() {
        return(
            <div>
                <h3 id ="Clock">Game clock: {this.state.hours}:{this.state.minutes}:{this.state.seconds}</h3>
            </div>
        );
    }

}