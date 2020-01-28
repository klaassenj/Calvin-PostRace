import React from 'react';
import TopNav from './topnav';
var createClass = require('create-react-class');
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import RaceCard from "./racecard"
import $ from "jquery"

module.exports = createClass({
    getInitialState: function () {
        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }
        return { data: [], _isMounted: false, featuredRace: undefined, possibleFeatures: [] };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        this.loadFeaturedRace();
    },
    componentWillUnmount: function () {
        // Reset the isMounted flag so that the loadCommentsFromServer callback
        // stops requesting state updates when the commentList has been unmounted.
        // This switch is optional, but it gets rid of the warning triggered by
        // setting state on an unmounted component.
        // See https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        this.state._isMounted = false;
    },

    loadFeaturedRace: function () {
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
                    this.setState({
                        possibleFeatures: result.filter(analysis => {
                            return analysis.attitude >= 8 && analysis.effort >= 8
                        })
                    });
                    this.setState({ featuredRace: possibleFeatures.random() })
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                    this.setState({ emptyMessage: "There was an error fetching the race data. Sorry. Check your internet settings, or submit a bug report." })
                }.bind(this));
        }
    },

    createCard: function (title, text) {
        return (
            <Card className="welcomeCard" raised={true} >
                <CardContent>
                    <Typography className="smallMargin" variant="h5">
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
        var DevNews = this.createCard("Development News", (
            <div id="jsx"><p> <b> 1/24/2020 </b></p>
                <p> Adding Mid-Distance Differentiation. Added the PR Table. </p>
                <p> <b> 1/8/2020 </b></p>
                <p> Switching into indoor season. Some backend changes. </p>
                <p> <b> 9/3/19 </b> </p>
                <p> Tried to make the interface a little more user friendly. Let me know if you like the changes. </p>
                <p> Archives Page Redesigned </p>
                <p> Started to transition the site design to Material Design. </p>
                <p> <b> 3/18/19 </b> </p>
                <p> Seperation of Current vs Archived Analysis </p>
                <p> Some Design Enhancements </p>
            </div>
        ));
        var Directions = this.createCard("What would you like to do?", (
                <div>
                    <p> To write analysis about a race, click the "New Analysis" tab</p>
                    <p> To see current season analysis from teammates, click the "Current" tab</p>
                    <p> To see past analysis from teammates and alumni, click the "Archives" tab</p>
                    {/* <p> To view and submit PRs for the athletes, click the "PRs" tab</p> */}
                    <p> If you've seen a glitch in the site or room for improvement for the site, click the "Feedback" tab</p>
                </div>
        ));
        if (this.state.featuredRace === undefined) {
            FeaturedRace = (<div></div>);
        } else {
            var FeaturedRace = (<div className="welcomeCard">
                <h4> Featured Race</h4>
                <RaceCard analysis={this.state.featuredRace} />
            </div>);
        }
        return (
            <div>
                <h1> Welcome to Calvin University Post Race Analysis! </h1>
                <TopNav></TopNav>
                <div className="wellSpaced"></div>
                {Directions}
                {FeaturedRace}
                {DevNews}
            </div>
        );
    }
});