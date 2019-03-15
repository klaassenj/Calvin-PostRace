import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {analysis: [], _isMounted: false, selectedRace: null, races: null};
    },
    componentDidMount: function() {
        this.state._isMounted = true;
        this.loadAnalysisFromServer();
    },
    componentWillUnmount: function() {
        this.state._isMounted = false;
    },
    loadAnalysisFromServer : function() {
        if (this.state._isMounted) {
            $.ajax({
                    url: "/api/races",
                    dataType: 'json',
                    cache: false
            })
            .done(function (result) {
                this.setState({analysis: result});
                console.log("Content Loaded.");
                console.log(this.state.analysis)
            }.bind(this))
            .fail(function (xhr, status, errorThrown) {
                console.error(API_URL, status, errorThrown.toString());
            }.bind(this));
        }
    },
    getRaces: function() {
        return [
            {
                id: "bigmeet",
                name: "Big Meet",
                runners: [ "Jon", "Charlie", "Caleb"]
            },
            {
                id: "miaaindoors",
                name: "MIAA Indoor Conference",
                runners: [ "Addison", "Jamo", "Micah", "Jon"]
            }
            ];
    },
    expand : function(id) {
        console.log(id);
        if(this.state.selectedRace != id) {
            this.state.selectedRace = id;
        } else {
            this.state.selectedRace = null;
        }

        console.log(this.state)
        this.setState({races : this.createHTML()});

    },
    navigate : function(analysis) {
        //AJAX Request to Database searching for a meet like race and a runner name
        // Save the returned data
        //.then (
        console.log("State Data from PastRaces:");
        console.log(analysis);
        if (data.length > 0) {
            browserHistory.push({
                pathname: "/race",
                state: { data: analysis }
            });
        } else {
            alert("No Data for " + runner + " at " + race);
        }


    },
    createHTML: function() {
        return this.state.analysis.map(analysis => {
            return (<a key= { analysis.name } onClick={ () => this.navigate(analysis) }> { analysis.name } @ { analysis.meet }</a>);
        });
        /*
        return this.getRaces().map(race => {
            if(race.id == this.state.selectedRace) {
                var Runners = race.runners.map(runner => {
                    return (<a key={runner} onClick={() => this.navigate(race.name, runner)}>{runner}</a>)
                });
                return (<div className="container racebox"><p id="raceTitle">{ race.name }</p> {Runners} </div>);
            } else {
                return(<a key={race.id} onClick={() => this.expand(race.id)}>{race.name}</a>);
            }

        });
        */
    },
    render: function() {
        this.state.races = this.createHTML();
        return (
            <div>
                <h1>Welcome to Past Races!</h1>
                <TopNav></TopNav>
                <div className="container">
                { this.state.races }
                </div>
            </div>
        );
    }
});
