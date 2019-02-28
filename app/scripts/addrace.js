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
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleMeetChange: function(e) {
        this.setState({meet: e.target.value});
    },
    handleGeneralThoughtsChange: function(e) {
        this.setState({thoughts: e.target.value});
    },
    handlePositivesChange: function(e) {

    },
    handleGoalChange: function(e) {

    },
    handleAttitudeChange: function(e) {

    },
    handleEffortChange: function(e) {

    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onAnalysisSubmit({author: author, text: text});
        this.setState(
            {author: '', 
            text: ''
        });
    },
    render: function() {
        return (
            <div>
                <h1>Welcome to the Analysis Form!</h1>
                <TopNav></TopNav>
                <form className="analysisForm" onSubmit={this.handleSubmit}>
                <input
                    id="name"
                    type="text"
                    placeholder="First and Last Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />
                <input
                    id="meet"
                    type="text"
                    placeholder="Meet and Event"
                    value={this.state.meet}
                    onChange={this.handleMeetChange}
                />
                <input type="submit" value="Post" />
            </form>
            <p>{this.state.name}</p>
            <p>{this.state.meet}</p>
            </div>
        );
    }
});