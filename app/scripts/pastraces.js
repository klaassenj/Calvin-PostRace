import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
var createClass = require('create-react-class');
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL, CURRENT_SEASON } from './global';
import { Typography } from '@material-ui/core';

module.exports = createClass({
    getInitialState: function () {
        return { analysis: [], _isMounted: false, selectedRace: null, races: null, search: "", header: CURRENT_SEASON, emptyMessage: "Loading Races..." };
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
    loadAnalysisFromServer: function () {
        if (this.state._isMounted) {
            $.ajax({
                url: "/api/races",
                dataType: 'json',
                cache: true
            })
                .done(function (result) {
                    if(!(result && result.length)) {
                        this.setState({emptyMessage: "There doesn't seem to be any races yet this season..."})
                    }
                    this.setState({ analysis: result });
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                    this.setState({emptyMessage: "There was an error fetching the race data. Sorry. Check your internet settings, or submit a bug report."})
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
        // Sorts results by date and places the latest results at the top
        relevantResults.sort((a, b) => parseFloat(b.date) - parseFloat(a.date));
        relevantResults.forEach(result => {
            console.log(result.ID + "  " + result.date)
        });
        return relevantResults.map(analysis => {
            var words = analysis.thoughts.substr(0, 40).split(" ");
            words.pop();
            var thoughts = words.join(" ") + "...";
            return (
                <a key={analysis.name + analysis.meet + Math.random(1000)} onClick={() => this.navigate(analysis)}>
                    <Card className="racecard" raised= { true } >
                        <CardContent>
                            <Typography variant = "headline" color="primary">
                                {analysis.name}
                            </Typography>
                            <Typography variant = "title">
                                {analysis.meet} {analysis.event}
                            </Typography>
                            <Typography>
                                { thoughts }
                            </Typography>

                        </CardContent>
                    </Card>
                </a>
            );

        });
    },
    render: function () {
        this.state.races = this.createHTML();
        return (
            <div>
                <h1>Current Season Race Analysis</h1>
                <TopNav></TopNav>
                <div className="container">
                    <div id="searchbar">
                        <input
                            id="name"
                            type="text"
                            placeholder="Search..."
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <h3> {this.state.header} </h3>
                    <p> { this.state.emptyMessage } </p>
                    <div id="racelist">
                        {this.state.races}
                    </div>
                </div>
            </div>
        );
    }
});
