import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, API_ARCHIVES_URL, SEASONS } from './global';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
var createClass = require('create-react-class');

module.exports = createClass({
    getInitialState: function () {
        return { analysis: [], _isMounted: false, currentSeason: "All Seasons", selectedRace: null, races: null, search: "", header: "Archived Race Analysis", seasons: [] };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        this.loadAnalysisFromServer();
        this.setState( { seasons: SEASONS } );
        
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },
    handleSearchChange: function (e) {
        this.setState({ search: e.target.value });
    },
    loadAnalysisFromServer: function () {
        if (this.state._isMounted) {
            $.ajax({
                url: API_ARCHIVES_URL,
                dataType: 'json',
                cache: true
            })
                .done(function (result) {
                    this.setState({ analysis: result });
                    console.log("Content Loaded.");
                    console.log(this.state.analysis)
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                }.bind(this));
        }
    },
    expand: function (id) {
        if (this.state.selectedRace != id) {
            this.state.selectedRace = id;
        } else {
            this.state.selectedRace = null;
        }
        this.setState({ races: this.createHTML() });

    },
    navigate: function (analysis) {
        //AJAX Request to Database searching for a meet like race and a runner name
        // Save the returned data
        //.then (
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
    chooseSeason: function (season) {
        this.setState({ currentSeason: season });
    },
    createHTML: function () {
        var relevantResults = this.state.analysis.filter(analysis => {
            if (this.state.search == "") {
                return true;
            } else {
                return this.searchSuccessful(analysis);
            }
        });
        if(this.state.currentSeason != "All Seasons") {
            relevantResults = relevantResults.filter(element => element.season == this.state.currentSeason)
        }
        // Sorts results by date and places the latest results at the top
        relevantResults.sort((a, b) => parseFloat(b.date) - parseFloat(a.date));
        return relevantResults.map(analysis => {
            var key = analysis.name + analysis.meet + Math.random(100);
            var clickFuntion = () => this.navigate(analysis);
            var words = analysis.thoughts.substr(0, 40).split(" ");
            words.pop();
            var thoughts = words.join(" ") + "...";
            return (<a key={key} onClick={clickFuntion}>
                <Card className="racecard" raised={true} >
                    <CardContent>
                        <Typography variant="headline" color="primary">
                            {analysis.name}
                        </Typography>
                        <Typography variant="title">
                            {analysis.meet} {analysis.event}
                        </Typography>
                        <Typography>
                            {thoughts}
                        </Typography>
                    </CardContent>
                </Card> </a>);
        });
    },
    render: function () {
        this.state.races = this.createHTML();
        var Radios = this.state.seasons.map(season => {
            return (
                <Tab key={season} id={season} onClick={() => this.chooseSeason(season)} name={season} label={season} value={season} />
            );
        });
        return (
            <div>
                <h1>Race Analysis Archives </h1>
                <TopNav></TopNav>
                <div className="container">
                    <Tabs
                        value={this.state.currentSeason}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {Radios}
                    </Tabs>
                    <div id="searchbar">
                        <input
                            id="name"
                            type="text"
                            placeholder={ "Search " + this.state.currentSeason + "..." }
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <div id="racelist">
                        {this.state.races}
                    </div>
                </div>
            </div>
        );
    }
});
