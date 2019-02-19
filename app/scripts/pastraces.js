import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {data: [], _isMounted: false};
    },
    componentDidMount: function() {
        this.state._isMounted = true;
    },
    componentWillUnmount: function() {
        this.state._isMounted = false;
    },
    render: function() {
        return (
            <div>
                <h1>Welcome to Past Races!</h1>
                <TopNav></TopNav>
            </div>
        );
    }
});