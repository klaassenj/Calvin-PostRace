import React from 'react';
import $ from 'jquery';
import '../css/base.css'
import { Router, Route, browserHistory } from 'react-router';
module.exports = React.createClass({
	
	getInitialState: function () {
        return {runner: ''};
    },
    componentDidMount: function () {
    	this.state._isMounted = true;
        console.log("State Data: ");
        console.log(this.props);
        console.log(this.props.location.state.data);
        this.setState(this.props.location.state.data);
    },

    navigate: function(route) {
        browserHistory.push({
            pathname:"/" + route,
        });
    },

	render: function() {
		var MeetAndEvent = (<p id="meet"> { this.state.meet} { this.state.event }</p>);
        var Name = (<p id="name"> {this.state.name}</p>);
        var Thoughts = (<p id="thoughts"> {this.state.thoughts}</p>)
        var Positives = (<p id="positives"> {this.state.positives}</p>)
        var Goal = (<p id="goal"> Goal: {this.state.goal}</p>)
        var Attitude = (<p id="attitude"> Attitude: {this.state.attitude}</p>)
        var Effort = (<p id="effort"> Effort: {this.state.effort}</p>)
        var Goal = (<p id="goal"> Goal: {this.state.goal}</p>)

        return (
            <div>
                <div className="container">
                    { MeetAndEvent }
                    { Name }
                    { Thoughts }
                    { Positives }
                    { Goal }
                    { Attitude }
                    { Effort }
                </div>
            </div>
            );
    }
});