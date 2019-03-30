import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {analysis: [], _isMounted: false, selectedRace: null, races: null, search: ""};
    },
    componentDidMount: function() {
        this.state._isMounted = true;
        this.loadAnalysisFromServer();
    },
    componentWillUnmount: function() {
        this.state._isMounted = false;
    },
    handleSearchChange: function(e) {
        this.setState({search: e.target.value});
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
        if (analysis != undefined && analysis != null) {
            browserHistory.push({
                pathname: "/race",
                state: { data: analysis }
            });
        } else {
            alert("No Data for that choice");
        }


    },
    searchSuccessful: function(analysis) {
        return analysis.name.toLowerCase().includes(this.state.search.toLowerCase()) || analysis.meet.toLowerCase().includes(this.state.search.toLowerCase());
    },
    createHTML: function() {
        var relevantResults = this.state.analysis.filter(analysis => {
            if(this.state.search == "") {
                return true;
            } else {
                return this.searchSuccessful(analysis);
            }
        })
        return relevantResults.map(analysis => {
            return (<a key= { analysis.name + analysis.meet + Math.random(1000) } onClick={ () => this.navigate(analysis) }> { analysis.name } @ { analysis.meet }</a>);    
            
        });
    },
    render: function() {
        this.state.races = this.createHTML();
        return (
            <div>
                <h1>Welcome to Past Races!</h1>
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
                    <div id="racelist">
                        { this.state.races }
                    </div>
                </div>
            </div>
        );
    }
});
