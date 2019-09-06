import React from 'react';
import '../css/base.css'
var createClass = require('create-react-class');
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { Router, Route, browserHistory } from 'react-router';
module.exports = createClass({

    getInitialState: function () {
        return { runner: '' };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        console.log("State Data: ");
        console.log(this.props);
        console.log(this.props.location.state.data);
        if (this.props.location.state.data) {
            this.setState(this.props.location.state.data);
        }
    },

    navigate: function (route) {
        browserHistory.push({
            pathname: "/" + route,
        });
    },

    editRace: function () {
        var race = {
            ID: this.state.ID,
            name: this.state.name,
            meet: this.state.meet,
            event: this.state.event,
            thoughts: this.state.thoughts,
            positives: this.state.positives,
            goal: this.state.goal,
            turnpoint: this.state.turnpoint,
            attitude: this.state.attitude,
            effort: this.state.effort
        };
        browserHistory.push({
            pathname: "/analysis",
            state: race
        });
    },

    createCard: function (title, text) {
        return (
            <Card className="racecard wellSpaced" raised={true} >
                <CardContent>
                    <Typography className="smallMargin" variant="title">
                        {title}
                    </Typography>
                    <Typography>
                        {text}
                    </Typography>
                </CardContent>
            </Card>
        );
    },

    render: function () {
        var Header = (<div id="header" > <h1 > {this.state.name} </h1> <h2>{this.state.meet} {this.state.event} </h2></div>);
        var Thoughts = this.createCard("General Thoughts", this.state.thoughts);
        var TurnPoint = this.createCard("Turning Points", this.state.turnpoint);
        var Positives = this.createCard("Positives", this.state.positives);
        var Goal = this.createCard("Goal", this.state.goal);
        var AE = this.createCard("Attitude: " + this.state.attitude + "\n" + "Effort: " + this.state.effort, "")
        return (
            <div>
                <div className="container">
                    <span>
                        <button id="back" onClick={() => this.navigate("pastraces")}>Back</button>
                        <button id="edit" onClick={this.editRace}>Edit</button>
                    </span>
                    {Header}
                    <div className="row">
                        <div className="column">
                            {Thoughts}
                            {TurnPoint}
                        </div>
                        <div className="column">
                            {Positives}
                            {Goal}
                            {AE}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});