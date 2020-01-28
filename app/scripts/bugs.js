import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
var createClass = require('create-react-class');
import { API_URL, API_BUGS_URL, POLL_INTERVAL } from './global';

module.exports = createClass({
    getInitialState: function () {
        return { data: [], _isMounted: false, bugdesc: "", name: "", submitted: "" };
    },
    insectList: function () {
        return ["beetle", "ant", "fly", "bee", "termite", "cricket",
            "butterfly", "grasshopper", "dragonfly", "mantis", "flea", "true bugs",
            "ladybug", "tyler", "housefly", "louse", "cicada", "silverfish", "UBH",
            "ubh", "scare", "scared", "scary", "hairy", "giant bug", "gross",
            "caterpillar", "squish", "squishy", "oozed", "killed", "dead", "insect",
            "dirsty", "dursty", "spider", "crawl", "creep"];
    },
    componentDidMount: function () {
        this.state._isMounted = true;
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },
    handleBugChange: function (e) {
        this.setState({ bugdesc: e.target.value });
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var isTyler = false;
        console.log(this.state.bugdesc)
        if (this.state.name.toLowerCase().includes("tyler")) {
            isTyler = true;
        }
        this.insectList().forEach(bug => {
            console.log(bug)
            if (new RegExp("\\b" + bug + "\\b").test(this.state.bugdesc)) {
                isTyler = true;
            }
        });
        console.log(isTyler)

        var bug = {
            name: this.state.name,
            bugdesc: this.state.bugdesc,
        };
        var message = isTyler ? "has failed successfully." : "Successful.";
        if (isTyler) alert("I'm sorry that bug report will not be processed because you're being an idiot, Tyler.")
        $.ajax({
            url: API_BUGS_URL,
            dataType: 'json',
            type: 'POST',
            data: bug,
        })
            .done(function (result) {
                this.setState({ submitted: "Bug Submission " + message })

            }.bind(this))
            .fail(function (xhr, status, errorThrown) {
                console.error(xAPI_URL, status, errorThrown.toString());
            }.bind(this));
    },

    render: function () {
        var SubmitButton = (<div className="submitbutton" >
                                <span>
                                    <input type="submit" value="Submit Report" />
                                    <p id="submitted"> {this.state.submitted} </p>
                                </span>
                            </div>
        );
        if (this.state.submitted) {
            SubmitButton = (<div></div>);
        }
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
                        placeholder="Describe the bug you encountered or possible improvement for the site. Be specific."
                        value={this.state.bugdesc}
                        rows="10"
                        onChange={this.handleBugChange}
                    />
                    {SubmitButton}
                </form>
            </div>
        );
    }
});