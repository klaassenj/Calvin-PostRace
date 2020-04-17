import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { Router, Route, browserHistory } from 'react-router';
var createClass = require('create-react-class');
import { API_URL, POLL_INTERVAL, MAINTAINERS } from './global';

module.exports = createClass({
    getInitialState: function () {
        return { hasAuth: false, data: [], maintainers: Maintainers, _isMounted: false, bugdesc: "", name: "", submitted: "" };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        if (!this.state.hasAuth) {
            if (this.authenticate()) {
                this.setState({ hasAuth: true })
            }
        }
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },

    createCard: function (title, text) {
        return (
            <Card className="racecard wellSpaced" raised={true} >
                <CardContent>
                    <Typography className="smallMargin" variant="h5">
                        {title}
                    </Typography>
                    <Typography component="span">
                        {text}
                    </Typography>
                </CardContent>
            </Card>
        );
    },
    navigate: function (route) {
        browserHistory.push({
            pathname: "/" + route,
        });
    },
    authenticate: function () {
        var answer = prompt("Password for Admin Dashboard?")
        if (answer != "encapsulation") { // Test password will be changed in production, use RSA for production
            alert("That is not the correct answer.\nReturning to Home Page.")
            this.navigate("")
            return false
        }
        this.setState({ hasAuth: true })
        alert("Access Granted.")
        return true
    },
    maintainersToString: function (persons) {
        var result = ""
        var ptags = persons.map(person => {
            return (<p> { person.name + " " + person.year + " --- " + person.phone } </p>)
        })
        return (<div className="wellSpaced">{ ptags } </div>)
    },

    render: function () {

        var launchNewSeason = this.createCard("New Season",
            "This is how you archive season analysis and clear out the current page and change the season name")
        var mlab = this.createCard("mLab", "To view all data collections, go to this link and sign in.")
        var Maintain = this.createCard("Maintainers", this.maintainersToString(Maintainers))
        var Page = (<div>
            <h1>Admin Page</h1>
            <TopNav></TopNav>
            <div className="noTouching">
                {launchNewSeason}
                {mlab}
                {Maintain}
            </div>
        </div>)
        if(!this.state.hasAuth) {
            Page = (<div>You are not an Administrator. Redirecting back to the home page...</div>)            
        }
        return Page;
    }
});