import React from 'react';
import $ from 'jquery';
import CommentList from './commentList';
import CommentForm from './commentForm';
import TopNav from './topnav'
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({

    getInitialState: function() {
        return {data: [], _isMounted: false, submitted: ""};
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
    handleEventChange: function(e) {
        this.setState({event: e.target.value});
    },
    handleThoughtsChange: function(e) {
        this.setState({thoughts: e.target.value});
    },
    handlePositivesChange: function(e) {
        this.setState({positives: e.target.value});
    },
    handleGoalChange: function(e) {
        this.setState({goal: e.target.value});
    },
    handleAttitudeChange: function(e) {
        this.setState({attitude: e.target.value});
    },
    handleEffortChange: function(e) {
        this.setState({effort: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var errors = [];

        if(this.state.event == undefined || this.state.event == "") {
            errors.push("The Event Field must be filled out.");
        }
        if(this.state.name == undefined || this.state.name == "") {
            errors.push("The Name Field must be filled out");
        }
        if(this.state.meet == undefined || this.state.meet == "") {
            errors.push("The Meet Field must be filled out");
        }
        if(errors.length == 0) {
            var race = { name : this.state.name,
                         meet : this.state.meet,
                         event : this.state.event,
                         thoughts : this.state.thoughts,
                         positives : this.state.positives,
                         goal : this.state.goal,
                         attitude : this.state.attitude,
                         effort : this.state.effort
                     };
            $.ajax({
                url: API_URL,
                dataType: 'json',
                type: 'POST',
                data: race,
            })
             .done(function(result){
                 console.log(result);
                 this.setState({submitted: "Submission Successful."});
             }.bind(this))
             .fail(function(xhr, status, errorThrown) {
                 console.error(xAPI_URL, status, errorThrown.toString());
             }.bind(this));
        } else {
            var message= "Sorry, you didn't fill out the form correctly:\n";
            errors.forEach(error => message += error + "\n");
            alert(message);
        }

    },
    getEventChoices: function() {
        //AJAX Call
        var events = [
            "", "5000m", "3000m", "1500m", "Steeple", "10000m", "Mile", "1600m", "800m", "400m", "400m Split"
        ]

        return events.map(event => {
            return (<option value = { event }> { event } </option>)
        });
        var confirmation = (<p> Thank you for completing your post race analysis! </p>)
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
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <input
                    id="meet"
                    type="text"
                    placeholder="Meet"
                    value={this.state.meet}
                    onChange={this.handleMeetChange}
                />
                <p> Event </p>
                <select name = "dropdown" onChange={this.handleEventChange}>
                    { this.getEventChoices() }
                </select>
                <textarea
                    id="thoughts"
                    type="text"
                    placeholder="General thoughts about the race"
                    value={this.state.thoughts}
                    rows="10"
                    onChange={this.handleThoughtsChange}
                />
                <textarea
                    id="positives"
                    type="text"
                    placeholder="Two positives and something to work on"
                    value={this.state.positives}
                    rows="10"
                    onChange={this.handlePositivesChange}
                />
                <textarea
                    id="goal"
                    type="text"
                    placeholder="Did you achieve what you set out to do? Was the goal realistic?"
                    value={this.state.goal}
                    rows="10"
                    onChange={this.handleGoalChange}
                />
                <input
                    id="attitude"
                    type="text"
                    min="1"
                    max="10"
                    placeholder="Attitude (1-10)"
                    value={this.state.attitude}
                    onChange={this.handleAttitudeChange}
                />
                <input
                    id="effort"
                    type="text"
                    min="1"
                    max="10"
                    placeholder="Effort (1-10)"
                    value={this.state.effort}
                    onChange={this.handleEffortChange}
                />

                <div className="row">
                    <input type="submit" value="Post" />
                    <p> { this.state.submitted } </p>
                </div>

            </form>

            </div>
            );
        }
    });
