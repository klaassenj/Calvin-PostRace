
import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import { API_URL, POLL_INTERVAL } from './global';
var createClass = require('create-react-class');
import Record from './record';
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

module.exports = createClass({
    getInitialState: function () {
        return { _isMounted: false, search: "", records: [] };
    },
    componenTableCellidMount: function () {
        this.state.records.push({
            name: "Charlie Kornoelje",
            five: "15:58",
            ten: "33:06",
            fifteen: "4:17"
        });
        this.setState({ isMounted: true });
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },
    handleSearchChange: function (e) {
        this.setState({ search: e.target.value });
    },
    loadPersonalRecords: function () {
        if (this.state._isMounted) {
            $.ajax({
                url: "/api/records",
                dataType: 'json',
                cache: true
            })
                .done(function (loadedRecords) {
                    this.setState({ records: loadedRecords })
                    console.log("Content Loaded.");
                    console.log(this.state.records)
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                }.bind(this));
        }
    },
    createHtml: function () {
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
    createRows: function () {
        return this.state.records.map(record => {
            return (
                <TableRow>
                    <TableCell className="pt-3-half" contentEditable="false">{record.name}</TableCell>
                    <TableCell className="pt-3-half" contentEditable="true">{record.fifteen}</TableCell>
                    <TableCell className="pt-3-half" contentEditable="true">{record.five}</TableCell>
                    <TableCell className="pt-3-half" contentEditable="true">{record.ten}</TableCell>
                    <TableCell className="pt-3-half" contentEditable="true">{record.steeple}</TableCell>
                </TableRow>
            );
        });
    },
    render: function () {
        var Records = this.createHtml();
        var tableRows = this.createRows();
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
                    <Table>
                        <TableHead>PRs</TableHead>
                        <TableBody>
                            { tableRows }
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
});
