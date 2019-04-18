import React from 'react';
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
        if(this.props.location.state.data) {
            this.setState(this.props.location.state.data);
        }
    },

    navigate: function(route) {
        browserHistory.push({
            pathname:"/" + route,
        });
    },

    editRace: function() {
        var race = { 
            ID : this.state.ID,
            name : this.state.name,
            meet : this.state.meet,
            event : this.state.event,
            thoughts : this.state.thoughts,
            positives : this.state.positives,
            goal : this.state.goal,
            turnpoint: this.state.turnpoint,
            attitude : this.state.attitude,
            effort : this.state.effort
        };
        browserHistory.push({
            pathname: "/analysis",
            state: race
        });
    },

	render: function() {
		var MeetAndEvent = (<p id="meet"> { this.state.meet} { this.state.event }</p>);
        var Name = (<p id="name"> {this.state.name}</p>);
        var Thoughts = (<p id="thoughts"> General Thoughts: {this.state.thoughts}</p>)
        var TurnPoint = (<p id="turnpoint"> Turning Points: {this.state.turnpoint}</p>)
        var Positives = (<p id="positives"> Positives: {this.state.positives}</p>)
        var Goal = (<p id="goal"> Goal: {this.state.goal}</p>)
        var Attitude = (<p id="attitude"> Attitude: {this.state.attitude}</p>)
        var Effort = (<p id="effort"> Effort: {this.state.effort}</p>)
        

        return (
            <div>
                <div className="container">
                    <span>
                        <button id="back" onClick={ () => this.navigate("pastraces")}>Back</button>
                        <button id="edit" onClick={ this.editRace }>Edit</button>
                    </span>
                    { MeetAndEvent }
                    { Name }
                    { Thoughts }
                    { TurnPoint }
                    { Positives }
                    { Goal }
                    { Attitude }
                    { Effort }
                </div>
            </div>
            );
    }
});