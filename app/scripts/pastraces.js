import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';

var createClass = require('create-react-class');
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL, CURRENT_SEASON } from './global';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import RaceCard from "./racecard"

const knightTheme = createMuiTheme({
    palette: {
        primary: { main: "#800000", contrastText: "#000" },
        secondary: { main: "#FFD700", contrastText: "#000" }
    }
});

module.exports = createClass({
    getInitialState: function () {
        return {
            analysis: [], _isMounted: false, selectedRace: null,
            races: null, search: "", header: CURRENT_SEASON, emptyMessage: "Loading Races...",
            groups: ["All Athletes", "Distance", "Mid-Distance"], group: "All Athletes"
        };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        this.loadAnalysisFromServer();
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },
    handleSearchChange: function (e) {
        this.setState({ search: e.target.value });
        if (this.state.search == "") {
            this.setState({ header: CURRENT_SEASON })
        } else {
            this.setState({ header: "Search Results" })
        }
    },
    chooseGroup: function (group) {
        this.setState({ group: group });
    },
    loadAnalysisFromServer: function () {
        if (this.state._isMounted) {
            $.ajax({
                url: "/api/races",
                dataType: 'json',
                cache: true
            })
                .done(function (result) {
                    if (!(result && result.length)) {
                        this.setState({ emptyMessage: "There doesn't seem to be any races yet this season..." })
                    }
                    this.setState({ analysis: result });
                    this.setState({ emptyMessage: "" });
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                    this.setState({ emptyMessage: "There was an error fetching the race data. Sorry. Check your internet settings, or submit a bug report." })
                }.bind(this));
        }
    },
    expand: function (id) {
        console.log(id);
        if (this.state.selectedRace != id) {
            this.state.selectedRace = id;
        } else {
            this.state.selectedRace = null;
        }

        console.log(this.state)
        this.setState({ races: this.createHTML() });

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
    searchSuccessful: function (analysis) {
        //var searchTerms = this.state.search.split(" "); // This could be useful for later
        return analysis.name.toLowerCase().includes(this.state.search.toLowerCase()) || analysis.meet.toLowerCase().includes(this.state.search.toLowerCase());
    },
    createHTML: function () {
        var relevantResults = this.state.analysis.filter(analysis => {
            if (this.state.search == "") {
                return true;
            } else {
                return this.searchSuccessful(analysis);
            }
        });
        if (this.state.group !== "All Athletes") {
            relevantResults = relevantResults.filter(analysis => {
                return analysis.group == this.state.group;
            });
        }
        // Sorts results by date and places the latest results at the top
        relevantResults.sort((a, b) => parseFloat(b.date) - parseFloat(a.date));
        relevantResults.forEach(result => {
            console.log(result.ID + "  " + result.date)
        });
        return relevantResults.map(analysis => {
            return <RaceCard key={analysis.name+analysis.meet+analysis.date} analysis={analysis}/>
        });
    },
    createHeader: function () {
        if (this.state.emptyMessage !== undefined || this.state.emptyMessage.isEmpty()) {
            return (<div>
                <Typography variant="h4" color="primary">
                    {this.state.header}
                </Typography>
                <Typography variant="body1">
                    {this.state.emptyMessage}
                </Typography></div>);
        }
        return (
            <Typography variant="h4" color="primary">
                {this.state.header}
            </Typography>);
    },
    render: function () {
        this.state.races = this.createHTML();
        var Radios = this.state.groups.map(group => {
            return (
                <Tab key={group} id={group} onClick={() => this.chooseGroup(group)} name={group} label={group} value={group} />
            );
        });
        var TabNav = (<Tabs
            value={this.state.group}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
            {Radios}
        </Tabs>
        );


        var Header = this.createHeader();
        return (
            <div>
                <h1>Current Season Race Analysis</h1>
                <TopNav></TopNav>
                <div className="container">
                    {TabNav}
                    <div id="searchbar">
                        <input
                            id="name"
                            type="text"
                            placeholder="Search..."
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    {Header}
                    <div id="racelist">
                        {this.state.races}
                    </div>
                </div>
            </div>
        );
    }
});
