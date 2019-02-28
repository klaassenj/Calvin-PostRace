import React from 'react';
import $ from 'jquery';
import '../css/base.css'
import { Router, Route, browserHistory } from 'react-router';
module.exports = React.createClass({
	
	getInitialState: function () {
        return {author: '', text: ''};
    },
    getMenuItems: function() {
    	return [ 
        	{
        		navItem: "Analysis",
        		route: "analysis"
        	},

        	{
        		navItem: "Race Archives",
        		route: "pastraces"
        	},

        	{
        		navItem: "Runner Archives",
        		route: "runners"
        	},

        	{
        		navItem: "About",
        		route: "about"
        	},

        	];
    },
    componentDidMount: function () {
    	this.state._isMounted = true;
    	
    },

    navigate: function(route) {
    	browserHistory.push(route);
    },

	render: function() {
		var MenuItems = this.getMenuItems().map(item => {
			return(<a key={item.route} onClick={() => this.navigate(item.route)}>{item.navItem}</a>);
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