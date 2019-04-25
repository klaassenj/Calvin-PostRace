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
        if(this.props) {
            this.setState(this.props);
        }
    },

    navigate: function(route) {
        browserHistory.push({
            pathname:"/" + route,
        });
    },

    editRace: function() {
        var race = { name : this.props.name,
            fifteen : this.props.fifteen,
            five : this.props.five,
            ten : this.props.ten,
            steeple : this.props.steeple
        };
        browserHistory.push({
            pathname: "/analysis",
            state: race
        });
    },

	render: function() {
		
        var Name = (<p id="name"> {this.state.name}</p>);
        var FifteenPR = (<p id="fifteen"> { this.state.fifteen } </p>);
        var FivePR = (<p id="five"> { this.state.five } </p>);
        var TenPR = (<p id="ten"> { this.state.ten } </p>);
        var SteeplePR = (<p id="steeple"> { this.state.steeple } </p>);

        return (
            <div>
                <div className="container">
                    <span><button id="edit" onClick={ this.editRace }>Edit</button></span>
                    { Name }
                    { FifteenPR }
                    { FivePR }
                    { TenPR }
                    { SteeplePR }
                </div>
            </div>
            );
    }
});