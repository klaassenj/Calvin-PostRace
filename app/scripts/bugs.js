import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { API_URL, API_BUGS_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {data: [], _isMounted: false, bugdesc: "", name: ""};
    },
    componentDidMount: function() {
        this.state._isMounted = true;
    },
    componentWillUnmount: function() {
        // Reset the isMounted flag so that the loadCommentsFromServer callback
        // stops requesting state updates when the commentList has been unmounted.
        // This switch is optional, but it gets rid of the warning triggered by
        // setting state on an unmounted component.
        // See https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        this.state._isMounted = false;
    },
    handleBugChange: function(e) {
        this.setState({bugdesc: e.target.value});
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var bug = { name : this.state.name,
                    bugdesc : this.state.bugdesc,
                 };
        $.ajax({
            url: API_BUGS_URL,
            dataType: 'json',
            type: 'POST',
            data: bug,
        })
         .done(function(result){
             console.log(result);
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(xAPI_URL, status, errorThrown.toString());
         }.bind(this));
    },
    render: function() {
        return (
            <div>
                <h1>Welcome to the Bug Reporter!</h1>
                <TopNav></TopNav>
                <form className="analysisForm" onSubmit={this.handleSubmit}>
                    <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                    />
                    <textarea
                        id="desc"
                        type="text"
                        className="widetextarea"
                        placeholder="Describe the bug you encountered. Be specific."
                        value={this.state.bugdesc}
                        rows="10"
                        onChange={this.handleBugChange}
                    />
                    <input type="submit" value="Submit Report" />
                </form>
            </div>
        );
    }
});