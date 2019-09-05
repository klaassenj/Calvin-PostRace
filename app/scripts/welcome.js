import React from 'react';
import TopNav from './topnav';
var createClass = require('create-react-class');

module.exports = createClass({
    getInitialState: function () {
        return { data: [], _isMounted: false };
    },
    componentDidMount: function () {
        this.state._isMounted = true;
    },
    componentWillUnmount: function () {
        // Reset the isMounted flag so that the loadCommentsFromServer callback
        // stops requesting state updates when the commentList has been unmounted.
        // This switch is optional, but it gets rid of the warning triggered by
        // setting state on an unmounted component.
        // See https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        this.state._isMounted = false;
    },
    render: function () {
        return (
            <div>
                <h1> Welcome to Calvin University Post Race Analysis! </h1>
                <TopNav></TopNav>
                <h2> What would you like to do? </h2>
                <p> To write analysis about a race, click the "New Analysis" tab</p>
                <p> To see current season analysis from teammates, click the "Current" tab</p>
                <p> To see past analysis from teammates and alumni, click the "Archives" tab</p>
                {/* <p> To view and submit PRs for the athletes, click the "PRs" tab</p> */}
                <p> If you've seen a glitch in the site or room for improvement for the site, click the "Feedback" tab</p>
                <h2> Development News</h2>
                <p> <b> 9/3/19 </b> </p>
                <p> Tried to make the interface a little more user friendly. Let me know if you like the changes. </p>
                <p> Archives Page Redesigned </p>
                <p> Started to transition the site design to Material Design. </p>
                <p> <b> 3/18/19 </b> </p>
                <p> Seperation of Current vs Archived Analysis </p>
                <p> Some Design Enhancements </p>
                
            </div>
        );
    }
});