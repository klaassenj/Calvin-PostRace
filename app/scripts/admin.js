import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { Router, Route, browserHistory } from 'react-router';
var createClass = require('create-react-class');
import { API_URL, POLL_INTERVAL, MAINTAINERS, MLAB_LINK, API_SEASON, API_RESTORE } from './global';

module.exports = createClass({
    getInitialState: function () {
        return { hasAuth: false, data: [], maintainers: MAINTAINERS, _isMounted: false, bugdesc: "", name: "", submitted: "" };
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
    restoreFromBackUp: function () {
        var response = confirm("You really messed up and hope that the backup is up to date?");
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {season: CURRENT_SEASON}
        })
        .done(function (result) {
            console.log("Backup successfully restored to Current Races")
            console.log("Check to ensure that the races have been saved.")
            console.log(result);
        }.bind(this))
        .fail(function (xhr, status, errorThrown) {
            console.error(API_RESTORE, status, errorThrown.toString());
            this.setState({ submitted: "Restore Failed. Try again with a better connection." });
        }.bind(this));
    },
    handleSeasonNameChange: function(e) {
        this.setState({newSeason: e.target.value})
    },
    handleLaunchNewSeason: function() {
        var confirmText = "Are you sure you want to end this season, archive all current races, and start " + this.state.newSeason +"?"
        var successText = "Backup Sychronized.\nCurrent Races Archived.\n"+ this.state.newSeason + " started."
        var cancelText = "Season switch cancelled.\nLook for your typos."
        var ready = confirm(confirmText)
        if(ready){
            $.ajax({
                url: API_SEASON,
                dataType: 'json',
                type: 'POST',
                data: race,
            })
                .done(function (result) {
                    console.log("Previous Season Archived")
                    console.log("New Season Started")
                    console.log(result);
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_SEASON, status, errorThrown.toString());
                    this.setState({ submitted: "Submission Failed. Try again with a better connection." });
                }.bind(this));
            // Synchronize Backup
            // Move Current Races into Archives
            // Clear Current Races
            alert(successText)
        } else {
            alert(cancelText)
        }
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
    createNewSeasonForm: function() {
        return (
            <Card className="racecard wellSpaced" raised={true} >
                <CardContent>
                    <Typography className="smallMargin" variant="h5">
                        {"New Season"}
                    </Typography>
                    <input id="" type="text" placeholder="Season Name" onChange={this.handleSeasonNameChange}></input>
                    <button id="newSeasonButton" className="submitbutton" onClick={this.handleLaunchNewSeason}>{ "Start New Season"}</button>
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
            return (<p> { person.name + " " + person.year + "―――" + person.phone }<hr></hr> </p>)
        })
        return (<div className="wellSpaced">{"If things have poorly. Here is the list of everyone who may know how to fix it."}{ ptags } </div>)
    },

    render: function () {
        
        var launchNewSeason = this.createNewSeasonForm();
        var mlab = (<a onClick={() => window.open(MLAB_LINK)}>{this.createCard("mLab", "To view all data collections, go to this link and sign in.")}</a>)
        var messUpButton = (<a onClick={() => this.restoreFromBackUp}>{this.createCard("Oh Shit all of the current races got deleted button.", "This will restore all current season analysis to the current races collection.")}</a>)
        var Maintain = this.createCard("Maintainers", this.maintainersToString(this.state.maintainers))
        var Page = (<div>
            <h1>Admin Page</h1>
            <TopNav></TopNav>
            <div className="noTouching">
                {launchNewSeason}
                {mlab}
                {messUpButton}
                {Maintain}

            </div>
        </div>)
        if(!this.state.hasAuth) {
            Page = (<div>You are not an Administrator. Redirecting back to the home page...</div>)            
        }
        return Page;
    }
});