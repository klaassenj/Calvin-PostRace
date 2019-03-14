import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {data: [], _isMounted: false, selectedRace: null, races: null};
    },
    componentDidMount: function() {
        this.state._isMounted = true;
    },
    componentWillUnmount: function() {
        this.state._isMounted = false;
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
    getAnalysis: function() {
        return [
            {
                id: "a",
                meet: "MIAA",
                event: "5k",
                name: "Micah",
                thoughts: "I ran really smart. I HATE Jack Beakas",
                positives: "I kicked really frickin hard. Dursted some people.",
                goal: "Almost got 4th.",
                attitude: "9.95",
                effort: "9.95"
            },
            {
                id: "b",
                meet: "MIAA 5k",
                name: "Jon",
                thoughts: "Lorem Ipsum",
                positives: "Positives",
                goal: "Almost got 1st.",
                attitude: "10",
                effort: "10"
            },
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
    navigate : function(race, runner) {
        //AJAX Request to Database searching for a meet like race and a runner name
        // Save the returned data
        //.then (
        var data = this.getAnalysis().filter(analysis => analysis.name == runner);
        console.log("State Data from PastRaces:")
        console.log(data);
        if (data.length > 0) {
            browserHistory.push({
                pathname: "/race",
                state: { data: data }
            });
        } else {
            alert("No Data for " + runner + " at " + race);
        }
        
        
    },
    createHTML: function() {
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