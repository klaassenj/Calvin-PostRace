import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import { Router, Route, browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {analysis: [], _isMounted: false, selectedRace: null, races: null, search: "", header: "Recently Added"};
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
        if(this.state.search == "") {
            this.setState({header: "Recently Added"})
        } else {
            this.setState({header: "Search Results"})
        }
    },
    loadAnalysisFromServer : function() {
        if (this.state._isMounted) {
            $.ajax({
                    url: "/api/races",
                    dataType: 'json',
                    cache: true
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
        //var searchTerms = this.state.search.split(" "); // This could be useful for later
        return analysis.name.toLowerCase().includes(this.state.search.toLowerCase()) || analysis.meet.toLowerCase().includes(this.state.search.toLowerCase());
    },
    createHTML: function() {
        var relevantResults = this.state.analysis.filter(analysis => {
            if(this.state.search == "") {
                return true;
            } else {
                return this.searchSuccessful(analysis);
            }
        });
        // Sorts results by date and places the latest results at the top
        relevantResults.sort((a,b) => parseFloat(b.date) - parseFloat(a.date));
        relevantResults.forEach(result => {
            console.log(result.ID + "  " + result.date)
        });
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
                    <h3> { this.state.header } </h3>
                    <div id="racelist">
                        { this.state.races }
                    </div>
                </div>
            </div>
        );
    }
});
