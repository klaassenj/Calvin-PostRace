import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import { API_URL, POLL_INTERVAL } from './global';
import Record from './record';

module.exports = React.createClass({
    getInitialState: function() {
        return { _isMounted: false, search: "", records: [] };
    },
    componentDidMount: function() {
        this.state.records.push({
            name: "Charlie Kornoelje",
            five: "15:58",
            ten: "33:06",
            fifteen: "4:17"
        });
        this.setState({isMounted: true});
    },
    componentWillUnmount: function() {
        this.state._isMounted = false;
    },
    handleSearchChange: function(e) {
        this.setState({search: e.target.value});
    },
    loadPersonalRecords: function() {
        if (this.state._isMounted && false) {
            $.ajax({
                    url: "/api/records",
                    dataType: 'json',
                    cache: true
            })
            .done(function (loadedRecords) {
                this.setState({records: loadedRecords})
                console.log("Content Loaded.");
                console.log(this.state.records)
            }.bind(this))
            .fail(function (xhr, status, errorThrown) {
                console.error(API_URL, status, errorThrown.toString());
            }.bind(this));
        }
    },
    createHtml: function() {
        return this.state.records.map(record => {
            return (<Record 
                name={record.name} 
                fifteen={record.fifteen}
                five={record.five}
                ten={record.ten}
                steeple={record.steeple}
                ></Record>);
        })
    },
    render: function() {
        var Records = this.createHtml();
        return (
            <div>
                <h1>Welcome to the PR Page!</h1>
                <TopNav></TopNav>
                <div className="container">
                    <div id="searchbar">
                        <input
                            id="name"
                            type="text"
                            placeholder="Search..."
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    { Records }
                </div>
            </div>
        );
    }
});
