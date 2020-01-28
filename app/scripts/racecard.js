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
        console.log("Props Data: ");
        console.log(this.props);
    },

    navigate: function (analysis) {
        //AJAX Request to Database searching for a meet like race and a runner name
        // Save the returned data
        //.then (
        console.log("State Data from PastRaces:");
        console.log(analysis);
        if (analysis != undefined && analysis != null) {
            browserHistory.push({
                pathname: "/race",
                state: { data: analysis }
            });
        } else {
            alert("No Data for that choice");
        }


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
        if (this.props.analysis == undefined) {
            return <div></div>
        }
        var analysis = this.props.analysis
        var words = this.props.analysis.thoughts.substr(0, 40).split(" ");
        words.pop();
        var thoughts = words.join(" ") + "...";
        return (
            <a key={analysis.name + analysis.meet + Math.random(1000)} onClick={() => this.navigate(analysis)}>
                <Card className="racecard" raised={true} >
                    <CardContent>
                        <Typography variant="h5" color="primary">
                            {analysis.name}
                        </Typography>
                        <Typography variant="h6">
                            {analysis.meet} {analysis.event}
                        </Typography>
                        <Typography>
                            {thoughts}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
});