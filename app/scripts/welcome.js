import React from 'react';
import TopNav from './topnav';
var createClass = require('create-react-class');
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import RaceCard from "./racecard"
import { Router, Route, browserHistory } from 'react-router';
import $ from "jquery"
// import { RSA, Crypt } from 'hybrid-crypto-js'
import { ENTROPY, API_ARCHIVES_URL } from './global';

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
                url: API_ARCHIVES_URL,
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
                    })
                    this.setState({ featuredRace: this.state.possibleFeatures.random() })
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_ARCHIVES_URL, status, errorThrown.toString());
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
                    <Typography component='span'>
                        {text}
                    </Typography>
                </CardContent>
            </Card>
        );
    },

    // authenticate: function() {
    //     const answer = prompt("Password for Admin Dashboard?")
    //     let publicKey = undefined
    //     $.ajax({
    //         url: "/api/auth",
    //         dataType: 'json',
    //         cache: true
    //     })
    //         .done(function (result) {
    //             console.log("Result from Auth Get")
    //             console.log(result)
    //             publicKey = result.rsa
    //             let crypt = new Crypt({entropy: ENTROPY})
    //             let encrypted = crypt.encrypt(answer, publicKey)
    //             console.log("Successful Encryption!")
    //             $.ajax({
    //                 url: "/api/auth",
    //                 type: "POST",
    //                 dataType: "json",
    //                 cache: false,
    //                 data: {answer: encrypted}
    //             }).done(function (result) {
    //                 console.log("Result from Auth POST")
    //                 console.log(result)
    //                 if(result.success) {
    //                     this.navigate(encrypted)
    //                     console.log("Successful Login!")
    //                 } else {
    //                     console.log("Unsuccessful Login. Try again.")
    //                 }
    //             })
    //         }.bind(this))
    //         .fail(function (xhr, status, errorThrown) {
    //             alert("That was not a valid password")
                
    //         }.bind(this));
    // },
    navigate: function (route, params) {
        if(params === undefined) {
            params = {}
        }
        browserHistory.push({
            pathname: "/" + route,
            state: {parameters:params}
        });
    },

    render: function () {
        var DevNews = this.createCard("Development News", (
            <div id="jsx">
                <p> <b> 4/12/2020 </b> </p>
                <p> Switching to this weird season of non-official training/racing</p>
                <p> Development started on Administrator dashboard</p>
                <p> <b> 1/24/2020 </b></p>
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
                <h2> Featured Race</h2>
                <RaceCard analysis={this.state.featuredRace} />
            </div>);
        }
        
        var AdminButton = (<button id="adminButton" className="navButton" onClick={() => this.navigate("admin")}>{"Administrator"}</button>)
        return (
            <div className="welcomePage">
                { AdminButton }
                <h1> Welcome to Calvin University Post Race Analysis! </h1>
                <TopNav></TopNav>
                <div className="wellSpaced">
                    {FeaturedRace}
                    {Directions}                    
                    {DevNews}
                </div>
            </div>
        );
    }
});