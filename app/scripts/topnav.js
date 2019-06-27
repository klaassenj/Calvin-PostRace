import React from 'react';
var createClass = require('create-react-class');
import $ from 'jquery';
import '../css/base.css'
import { Router, Route, browserHistory } from 'react-router';
module.exports = createClass({

    getInitialState: function () {
        return { author: '', text: '' };
    },
    getMenuItems: function () {
        return [
            {
                navItem: "Home",
                route: ""
            },
            {
                navItem: "Analysis",
                route: "analysis"
            },

            {
                navItem: "Current",
                route: "pastraces"
            },
            {
                navItem: "PRs",
                route: "records"
            },
            {
                navItem: "Archives",
                route: "archives"
            },
            {
                navItem: "Feedback",
                route: "bugs"
            }
        ];
    },
    componentDidMount: function () {
        this.state._isMounted = true;

    },

    navigate: function (route) {
        browserHistory.push({
            pathname: "/" + route,
        });
    },

    render: function () {
        var MenuItems = this.getMenuItems().map(item => {
            return (<a key={item.route} onClick={() => this.navigate(item.route)}>{item.navItem}</a>);
        });
        return (
            <div>
                <div className="topnav">
                    {MenuItems}
                </div>
            </div>
        );
    }
});